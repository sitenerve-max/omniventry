import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CustomerQuotationStatus, Prisma, PurchaseOrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.module';
import { AuthenticatedUser } from '../auth/guards';
import { DemoFlatMarginPricingService } from '../pricing/pricing.service';
import { CreateCustomerQuotationDto, NegotiateQuotationDto } from './dto';

/** Statuses a customer must never see (internal drafting/approval). */
const INTERNAL_ONLY_STATUSES: CustomerQuotationStatus[] = [CustomerQuotationStatus.DRAFT, CustomerQuotationStatus.PENDING_APPROVAL];
const RESPONDABLE_STATUSES: CustomerQuotationStatus[] = [
  CustomerQuotationStatus.SENT,
  CustomerQuotationStatus.VIEWED,
  CustomerQuotationStatus.NEGOTIATION,
];

/** Customer-facing projection: strips internal pricing-method/margin hints and internal user ids. */
function toCustomerView<T extends { calculationLabel: string | null; isDemoCalculation: boolean; createdByUserId: string }>(quotation: T) {
  const { calculationLabel: _label, isDemoCalculation: _demo, createdByUserId: _by, ...safe } = quotation;
  void _label; void _demo; void _by;
  return safe;
}

@Injectable()
export class CustomerQuotationsService {
  private readonly pricing = new DemoFlatMarginPricingService();

  constructor(private readonly prisma: PrismaService) {}

  /** Admin: builds a quotation from selected SupplierQuoteItem rows via the (currently Demo) PricingService. */
  async adminCreate(dto: CreateCustomerQuotationDto, createdByUserId: string) {
    const rfq = await this.prisma.rfq.findUnique({ where: { id: dto.rfqId } });
    if (!rfq) {
      throw new NotFoundException('RFQ not found');
    }
    const quoteItems = await this.prisma.supplierQuoteItem.findMany({
      where: { id: { in: dto.supplierQuoteItemIds } },
      include: { rfqItem: true },
    });
    if (quoteItems.length === 0) {
      throw new BadRequestException('No supplier quote items were selected');
    }

    const products = await this.prisma.product.findMany({
      where: { mpn: { in: quoteItems.map((i) => i.mpn) } },
      include: { manufacturer: true },
    });

    const priced = await this.pricing.calculateCustomerQuotation({
      currency: rfq.currency,
      lines: quoteItems.map((item) => {
        const product = products.find((p) => p.mpn === item.mpn);
        // Quote for what the customer actually needs, never more than the supplier can supply.
        const quantity = Math.min(item.rfqItem.requiredQuantity, item.availableQuantity);
        return {
          mpn: item.mpn,
          manufacturer: product?.manufacturer.name ?? item.mpn,
          description: product?.description ?? '',
          quantity,
          supplierUnitPrice: Number(item.unitPrice),
          dateCode: item.dateCode,
          countryOfOrigin: item.countryOfOrigin ?? '',
          leadTime: item.leadTime,
          warranty: item.warranty ?? undefined,
        };
      }),
    });

    const quoteNumber = `Q-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    return this.prisma.customerQuotation.create({
      data: {
        quoteNumber,
        rfqId: rfq.id,
        customerId: rfq.customerId,
        createdByUserId,
        status: CustomerQuotationStatus.DRAFT,
        currency: rfq.currency,
        subtotal: priced.subtotal,
        freight: priced.freight,
        gst: priced.gst,
        total: priced.total,
        paymentTerms: rfq.paymentTerms,
        validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
        isDemoCalculation: priced.isDemoCalculation,
        calculationLabel: priced.calculationLabel,
        items: {
          create: priced.items.map((item) => ({
            mpn: item.mpn,
            manufacturer: item.manufacturer,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            dateCode: item.dateCode,
            countryOfOrigin: item.countryOfOrigin,
            leadTime: item.leadTime,
            warranty: item.warranty,
          })),
        },
      },
      include: { items: true },
    });
  }

  async adminFindAll() {
    return this.prisma.customerQuotation.findMany({
      include: { items: true, customer: true, rfq: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async adminFindOne(id: string) {
    const quotation = await this.prisma.customerQuotation.findUnique({
      where: { id },
      include: { items: true, customer: true, rfq: true },
    });
    if (!quotation) {
      throw new NotFoundException('Customer quotation not found');
    }
    return quotation;
  }

  async adminUpdateStatus(id: string, status: CustomerQuotationStatus) {
    await this.findByIdOrThrow(id);
    return this.prisma.customerQuotation.update({ where: { id }, data: { status } });
  }

  async customerFindAll(user: AuthenticatedUser) {
    if (!user.customerId) {
      throw new ForbiddenException('Only customer accounts can view quotations');
    }
    const rows = await this.prisma.customerQuotation.findMany({
      where: { customerId: user.customerId, status: { notIn: INTERNAL_ONLY_STATUSES } },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(toCustomerView);
  }

  async customerFindOne(user: AuthenticatedUser, id: string) {
    const quotation = await this.assertCustomerOwnership(user, id);
    if (INTERNAL_ONLY_STATUSES.includes(quotation.status)) {
      throw new NotFoundException('Customer quotation not found');
    }
    if (quotation.status === CustomerQuotationStatus.SENT) {
      await this.prisma.customerQuotation.update({ where: { id }, data: { status: CustomerQuotationStatus.VIEWED } });
      return toCustomerView({ ...quotation, status: CustomerQuotationStatus.VIEWED });
    }
    return toCustomerView(quotation);
  }

  /** Customer accepts: marks the quotation ACCEPTED and creates a basic Purchase Order. */
  async accept(user: AuthenticatedUser, id: string) {
    const quotation = await this.assertRespondable(user, id);
    // The status flip and the PO creation share one transaction, and the flip is conditional
    // (only from a respondable status), so concurrent accepts can produce at most one PO.
    return this.prisma.$transaction(async (tx) => {
      await this.claim(tx, quotation.id, CustomerQuotationStatus.ACCEPTED);
      const updated = await tx.customerQuotation.findUniqueOrThrow({ where: { id }, include: { items: true } });
      const poNumber = `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const purchaseOrder = await tx.purchaseOrder.create({
        data: {
          poNumber,
          customerId: quotation.customerId,
          customerQuotationId: quotation.id,
          status: PurchaseOrderStatus.CREATED,
          totalAmount: updated.total,
          items: {
            create: updated.items.map((item) => ({
              mpn: item.mpn,
              manufacturer: item.manufacturer,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
        include: { items: true },
      });
      await tx.rfq.update({ where: { id: quotation.rfqId }, data: { status: 'PO_RECEIVED' } });
      return { quotation: toCustomerView(updated), purchaseOrder };
    });
  }

  /** Conditional status flip: succeeds only if the quotation is still in a respondable status. */
  private async claim(tx: Prisma.TransactionClient, id: string, next: CustomerQuotationStatus) {
    const res = await tx.customerQuotation.updateMany({
      where: { id, status: { in: RESPONDABLE_STATUSES } },
      data: { status: next },
    });
    if (res.count !== 1) {
      throw new BadRequestException('This quotation has already been responded to');
    }
  }

  async reject(user: AuthenticatedUser, id: string) {
    await this.assertRespondable(user, id);
    return this.prisma.$transaction(async (tx) => {
      await this.claim(tx, id, CustomerQuotationStatus.REJECTED);
      return toCustomerView(await tx.customerQuotation.findUniqueOrThrow({ where: { id }, include: { items: true } }));
    });
  }

  /**
   * Marks the quotation NEGOTIATION. `dto.note` is accepted for API-contract stability but not
   * yet persisted — a negotiation-log table is out of this pass's scope.
   */
  async negotiate(user: AuthenticatedUser, id: string, dto: NegotiateQuotationDto) {
    await this.assertRespondable(user, id);
    void dto;
    return this.prisma.$transaction(async (tx) => {
      await this.claim(tx, id, CustomerQuotationStatus.NEGOTIATION);
      return toCustomerView(await tx.customerQuotation.findUniqueOrThrow({ where: { id }, include: { items: true } }));
    });
  }

  /** Ownership + state check: a customer can only respond to a quotation that was actually sent to them and is still open. */
  private async assertRespondable(user: AuthenticatedUser, id: string) {
    const quotation = await this.assertCustomerOwnership(user, id);
    if (!RESPONDABLE_STATUSES.includes(quotation.status)) {
      throw new BadRequestException(`Quotation in status ${quotation.status} cannot be responded to`);
    }
    return quotation;
  }

  private async findByIdOrThrow(id: string) {
    const quotation = await this.prisma.customerQuotation.findUnique({ where: { id }, include: { items: true } });
    if (!quotation) {
      throw new NotFoundException('Customer quotation not found');
    }
    return quotation;
  }

  private async assertCustomerOwnership(user: AuthenticatedUser, id: string) {
    const quotation = await this.findByIdOrThrow(id);
    if (quotation.customerId !== user.customerId) {
      throw new ForbiddenException('You do not have access to this quotation');
    }
    return quotation;
  }
}
