import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { VendorRfqStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.module';
import { AuthenticatedUser } from '../auth/guards';
import { DeterministicMatchingService } from '../matching/matching.service';

/**
 * Allowlist of RFQ fields a supplier may see. Deliberately excludes the customer's target
 * price (RfqItem.targetPriceInr), customer id, and internal ids/audit fields.
 */
const SUPPLIER_SAFE_RFQ = {
  select: {
    id: true,
    rfqNumber: true,
    deliveryLocation: true,
    requiredDate: true,
    currency: true,
    items: {
      select: {
        id: true,
        mpn: true,
        manufacturer: true,
        requiredQuantity: true,
        packagingRequirement: true,
        dateCodeRequirement: true,
        qualityRequirement: true,
      },
    },
  },
} as const;

@Injectable()
export class VendorRfqsService {
  private readonly matching = new DeterministicMatchingService();

  constructor(private readonly prisma: PrismaService) {}

  /** Admin: runs deterministic matching for an RFQ's items and creates VendorRfq rows for the top candidates per item's MPN. */
  async createForRfq(rfqId: string) {
    const rfq = await this.prisma.rfq.findUnique({ where: { id: rfqId }, include: { items: true } });
    if (!rfq) {
      throw new NotFoundException('RFQ not found');
    }

    const matchedSupplierIds = new Set<string>();
    for (const item of rfq.items) {
      const inventoryRows = await this.prisma.inventory.findMany({
        where: { product: { mpn: item.mpn }, status: 'ACTIVE' },
        include: { supplier: true },
      });
      const candidates = inventoryRows.map((inv) => ({
        supplierId: inv.supplierId,
        companyName: inv.supplier.companyName,
        isVerified: inv.supplier.isVerified,
        city: inv.supplier.city,
        state: inv.supplier.state,
        supplierScore: inv.supplier.supplierScore,
        availableQuantity: inv.quantity,
      }));
      const matches = this.matching.findCandidateSuppliers({
        mpn: item.mpn,
        requiredQuantity: item.requiredQuantity,
        deliveryLocation: rfq.deliveryLocation,
        candidates,
      });
      matches.forEach((m) => matchedSupplierIds.add(m.supplierId));
    }

    const vendorRfqs = await Promise.all(
      [...matchedSupplierIds].map((supplierId) =>
        this.prisma.vendorRfq.upsert({
          where: { rfqId_supplierId: { rfqId, supplierId } },
          create: {
            rfqId,
            supplierId,
            status: VendorRfqStatus.SENT,
            items: { create: rfq.items.map((item) => ({ rfqItemId: item.id })) },
          },
          update: {},
        }),
      ),
    );

    await this.prisma.rfq.update({ where: { id: rfqId }, data: { status: 'VENDOR_RFQ_SENT' } });
    return vendorRfqs;
  }

  async adminFindAll() {
    return this.prisma.vendorRfq.findMany({
      include: { rfq: true, supplier: true, quotes: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async adminFindOne(id: string) {
    const vendorRfq = await this.prisma.vendorRfq.findUnique({
      where: { id },
      include: { rfq: { include: { items: true } }, supplier: true, quotes: { include: { items: true } } },
    });
    if (!vendorRfq) {
      throw new NotFoundException('Vendor RFQ not found');
    }
    return vendorRfq;
  }

  async adminUpdateStatus(id: string, status: VendorRfqStatus) {
    await this.adminFindOne(id);
    return this.prisma.vendorRfq.update({ where: { id }, data: { status } });
  }

  private async assertSupplierOwnership(user: AuthenticatedUser, vendorRfqId: string) {
    if (!user.supplierId) {
      throw new ForbiddenException('Only supplier accounts can access vendor RFQs');
    }
    const vendorRfq = await this.prisma.vendorRfq.findUnique({ where: { id: vendorRfqId } });
    if (!vendorRfq) {
      throw new NotFoundException('Vendor RFQ not found');
    }
    if (vendorRfq.supplierId !== user.supplierId) {
      throw new ForbiddenException('You do not have access to this vendor RFQ');
    }
    return vendorRfq;
  }

  async supplierFindAll(user: AuthenticatedUser) {
    if (!user.supplierId) {
      throw new ForbiddenException('Only supplier accounts can access vendor RFQs');
    }
    return this.prisma.vendorRfq.findMany({
      where: { supplierId: user.supplierId },
      include: { rfq: SUPPLIER_SAFE_RFQ, quotes: { include: { items: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async supplierFindOne(user: AuthenticatedUser, id: string) {
    await this.assertSupplierOwnership(user, id);
    return this.prisma.vendorRfq.findUnique({
      where: { id },
      include: { rfq: SUPPLIER_SAFE_RFQ, quotes: { include: { items: true } } },
    });
  }

  async assertOwnershipForQuote(user: AuthenticatedUser, vendorRfqId: string) {
    const vendorRfq = await this.assertSupplierOwnership(user, vendorRfqId);
    if (vendorRfq.status !== VendorRfqStatus.SENT) {
      throw new BadRequestException('This vendor RFQ has already been responded to');
    }
    return vendorRfq;
  }
}
