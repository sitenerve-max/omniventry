import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { RoleName, RfqStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.module';
import { AuthenticatedUser } from '../auth/guards';
import { CreateRfqDto, UpdateRfqDto } from './dto';

const ADMIN_ROLES: RoleName[] = [
  RoleName.SUPER_ADMIN,
  RoleName.ADMIN,
  RoleName.SALES_MANAGER,
  RoleName.SALES_EXECUTIVE,
  RoleName.PURCHASE_MANAGER,
  RoleName.PURCHASE_EXECUTIVE,
];

@Injectable()
export class RfqsService {
  constructor(private readonly prisma: PrismaService) {}

  private isAdmin(user: AuthenticatedUser): boolean {
    return user.roles.some((r) => ADMIN_ROLES.includes(r));
  }

  async create(user: AuthenticatedUser, dto: CreateRfqDto) {
    if (!user.customerId) {
      throw new ForbiddenException('Only customer accounts can create RFQs');
    }
    const rfqNumber = `RFQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const rfq = await this.prisma.rfq.create({
      data: {
        rfqNumber,
        customerId: user.customerId,
        createdByUserId: user.userId,
        status: RfqStatus.DRAFT,
        requiredDate: dto.requiredDate ? new Date(dto.requiredDate) : undefined,
        deliveryLocation: dto.deliveryLocation,
        currency: dto.currency ?? 'INR',
        paymentTerms: dto.paymentTerms,
        remarks: dto.remarks,
        items: {
          create: dto.lineItems.map((item) => ({
            mpn: item.mpn,
            manufacturer: item.manufacturer,
            requiredQuantity: item.requiredQuantity,
            targetPriceInr: item.targetPriceInr,
            packagingRequirement: item.packagingRequirement,
            dateCodeRequirement: item.dateCodeRequirement,
            qualityRequirement: item.qualityRequirement,
            notes: item.notes,
          })),
        },
      },
      include: { items: true },
    });
    return rfq;
  }

  async findAll(user: AuthenticatedUser) {
    return this.prisma.rfq.findMany({
      where: this.isAdmin(user) ? {} : { customerId: user.customerId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(user: AuthenticatedUser, id: string) {
    const rfq = await this.prisma.rfq.findUnique({ where: { id }, include: { items: true } });
    if (!rfq) {
      throw new NotFoundException('RFQ not found');
    }
    if (!this.isAdmin(user) && rfq.customerId !== user.customerId) {
      throw new ForbiddenException('You do not have access to this RFQ');
    }
    return rfq;
  }

  async update(user: AuthenticatedUser, id: string, dto: UpdateRfqDto) {
    const rfq = await this.findOne(user, id);
    if (rfq.status !== RfqStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT RFQs can be edited');
    }
    return this.prisma.rfq.update({
      where: { id },
      data: {
        requiredDate: dto.requiredDate ? new Date(dto.requiredDate) : undefined,
        deliveryLocation: dto.deliveryLocation,
        currency: dto.currency,
        paymentTerms: dto.paymentTerms,
        remarks: dto.remarks,
      },
      include: { items: true },
    });
  }

  async submit(user: AuthenticatedUser, id: string) {
    const rfq = await this.findOne(user, id);
    if (rfq.status !== RfqStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT RFQs can be submitted');
    }
    return this.prisma.rfq.update({
      where: { id },
      data: { status: RfqStatus.SUBMITTED },
      include: { items: true },
    });
  }

  async cancel(user: AuthenticatedUser, id: string) {
    const rfq = await this.findOne(user, id);
    const terminalStatuses: RfqStatus[] = [RfqStatus.COMPLETED, RfqStatus.CANCELLED];
    if (terminalStatuses.includes(rfq.status)) {
      throw new BadRequestException(`RFQ in status ${rfq.status} cannot be cancelled`);
    }
    return this.prisma.rfq.update({ where: { id }, data: { status: RfqStatus.CANCELLED } });
  }
}
