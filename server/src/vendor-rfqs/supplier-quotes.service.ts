import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, SupplierQuoteStatus, VendorRfqStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.module';
import { AuthenticatedUser } from '../auth/guards';
import { VendorRfqsService } from './vendor-rfqs.service';
import { SubmitQuoteDto } from './dto';

export interface CoverageSummary {
  mpn: string;
  requiredQuantity: number;
  totalQuotedQuantity: number;
  remainingQuantity: number;
  coveragePercent: number;
}

@Injectable()
export class SupplierQuotesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vendorRfqsService: VendorRfqsService,
  ) {}

  async submitQuote(user: AuthenticatedUser, vendorRfqId: string, dto: SubmitQuoteDto) {
    const vendorRfq = await this.vendorRfqsService.assertOwnershipForQuote(user, vendorRfqId);
    return this.saveQuote(vendorRfq.id, user.supplierId!, SupplierQuoteStatus.SUBMITTED, dto);
  }

  async submitPartialSupply(user: AuthenticatedUser, vendorRfqId: string, dto: SubmitQuoteDto) {
    const vendorRfq = await this.vendorRfqsService.assertOwnershipForQuote(user, vendorRfqId);
    return this.saveQuote(vendorRfq.id, user.supplierId!, SupplierQuoteStatus.PARTIAL_SUPPLY, dto);
  }

  async cannotSupply(user: AuthenticatedUser, vendorRfqId: string, remarks?: string) {
    const vendorRfq = await this.vendorRfqsService.assertOwnershipForQuote(user, vendorRfqId);
    return this.prisma.$transaction(async (tx) => {
      await this.claimVendorRfq(tx, vendorRfq.id, user.supplierId!, VendorRfqStatus.DECLINED);
      return tx.supplierQuote.create({
        data: { vendorRfqId: vendorRfq.id, supplierId: user.supplierId!, status: SupplierQuoteStatus.CANNOT_SUPPLY, remarks },
      });
    });
  }

  /** Atomically moves a vendor RFQ out of SENT; if a concurrent request already responded, this throws instead of double-writing. */
  private async claimVendorRfq(tx: Prisma.TransactionClient, vendorRfqId: string, supplierId: string, next: VendorRfqStatus) {
    const claimed = await tx.vendorRfq.updateMany({
      where: { id: vendorRfqId, supplierId, status: VendorRfqStatus.SENT },
      data: { status: next, respondedAt: new Date() },
    });
    if (claimed.count !== 1) {
      throw new BadRequestException('This vendor RFQ has already been responded to');
    }
  }

  private async saveQuote(vendorRfqId: string, supplierId: string, status: SupplierQuoteStatus, dto: SubmitQuoteDto) {
    if (dto.items.length === 0) {
      throw new BadRequestException('At least one quote item is required');
    }
    const allowed = await this.prisma.vendorRfqItem.findMany({ where: { vendorRfqId }, select: { rfqItemId: true } });
    const allowedIds = new Set(allowed.map((a) => a.rfqItemId));
    if (dto.items.some((item) => !allowedIds.has(item.rfqItemId))) {
      throw new BadRequestException('Quote contains an item that is not part of this vendor RFQ');
    }
    return this.prisma.$transaction(async (tx) => {
      await this.claimVendorRfq(tx, vendorRfqId, supplierId, VendorRfqStatus.RESPONDED);
      return tx.supplierQuote.create({
        data: {
          vendorRfqId,
          supplierId,
          status,
          currency: dto.currency ?? 'INR',
          remarks: dto.remarks,
          items: {
            create: dto.items.map((item) => ({
              rfqItemId: item.rfqItemId,
              mpn: item.mpn,
              availableQuantity: item.availableQuantity,
              unitPrice: item.unitPrice,
              moq: item.moq,
              dateCode: item.dateCode,
              packaging: item.packaging,
              leadTime: item.leadTime,
              warranty: item.warranty,
              countryOfOrigin: item.countryOfOrigin,
              certificateAvailable: item.certificateAvailable ?? false,
              condition: item.condition,
              notes: item.notes,
            })),
          },
        },
        include: { items: true },
      });
    });
  }

  async adminFindAll() {
    return this.prisma.supplierQuote.findMany({
      include: { supplier: true, items: true, vendorRfq: { include: { rfq: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async adminFindOne(id: string) {
    const quote = await this.prisma.supplierQuote.findUnique({
      where: { id },
      include: { supplier: true, items: true, vendorRfq: { include: { rfq: true } } },
    });
    if (!quote) {
      throw new NotFoundException('Supplier quote not found');
    }
    return quote;
  }

  /** Comparison view for one RFQ: every supplier quote item grouped by MPN, plus coverage math. */
  async adminCompareForRfq(rfqId: string) {
    const rfq = await this.prisma.rfq.findUnique({ where: { id: rfqId }, include: { items: true } });
    if (!rfq) {
      throw new NotFoundException('RFQ not found');
    }
    const quotes = await this.prisma.supplierQuote.findMany({
      where: { vendorRfq: { rfqId } },
      include: { supplier: true, items: true },
    });

    const coverage: CoverageSummary[] = rfq.items.map((rfqItem) => {
      const totalQuoted = quotes
        .flatMap((q) => q.items)
        .filter((item) => item.rfqItemId === rfqItem.id)
        .reduce((sum, item) => sum + item.availableQuantity, 0);
      const remaining = Math.max(0, rfqItem.requiredQuantity - totalQuoted);
      return {
        mpn: rfqItem.mpn,
        requiredQuantity: rfqItem.requiredQuantity,
        totalQuotedQuantity: totalQuoted,
        remainingQuantity: remaining,
        coveragePercent: rfqItem.requiredQuantity > 0 ? Math.round((totalQuoted / rfqItem.requiredQuantity) * 100) : 0,
      };
    });

    return { quotes, coverage };
  }
}
