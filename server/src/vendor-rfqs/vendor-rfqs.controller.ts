import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleName } from '@prisma/client';
import { CurrentUser, AuthenticatedUser, JwtAuthGuard, Roles } from '../auth/guards';
import { RolesGuard } from '../auth/guards';
import { VendorRfqsService } from './vendor-rfqs.service';
import { SupplierQuotesService } from './supplier-quotes.service';
import { CannotSupplyDto, SubmitQuoteDto, UpdateVendorRfqStatusDto } from './dto';

const ADMIN_ROLES = [
  RoleName.SUPER_ADMIN,
  RoleName.ADMIN,
  RoleName.SALES_MANAGER,
  RoleName.SALES_EXECUTIVE,
  RoleName.PURCHASE_MANAGER,
  RoleName.PURCHASE_EXECUTIVE,
];

@ApiTags('admin-vendor-rfqs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(...ADMIN_ROLES)
@Controller('api/admin')
export class AdminVendorRfqsController {
  constructor(
    private readonly vendorRfqsService: VendorRfqsService,
    private readonly supplierQuotesService: SupplierQuotesService,
  ) {}

  @Get('vendor-rfqs')
  async findAll() {
    return { success: true, data: await this.vendorRfqsService.adminFindAll() };
  }

  @Get('vendor-rfqs/:id')
  async findOne(@Param('id') id: string) {
    return { success: true, data: await this.vendorRfqsService.adminFindOne(id) };
  }

  @Post('rfqs/:id/vendor-rfqs')
  async createForRfq(@Param('id') rfqId: string) {
    return { success: true, data: await this.vendorRfqsService.createForRfq(rfqId) };
  }

  @Patch('vendor-rfqs/:id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateVendorRfqStatusDto) {
    return { success: true, data: await this.vendorRfqsService.adminUpdateStatus(id, dto.status) };
  }

  @Get('supplier-quotes')
  async findAllQuotes() {
    return { success: true, data: await this.supplierQuotesService.adminFindAll() };
  }

  @Get('supplier-quotes/:id')
  async findOneQuote(@Param('id') id: string) {
    return { success: true, data: await this.supplierQuotesService.adminFindOne(id) };
  }

  @Get('rfqs/:id/supplier-quotes')
  async compareForRfq(@Param('id') rfqId: string) {
    return { success: true, data: await this.supplierQuotesService.adminCompareForRfq(rfqId) };
  }
}

@ApiTags('supplier-vendor-rfqs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.SUPPLIER)
@Controller('api/supplier/vendor-rfqs')
export class SupplierVendorRfqsController {
  constructor(
    private readonly vendorRfqsService: VendorRfqsService,
    private readonly supplierQuotesService: SupplierQuotesService,
  ) {}

  @Get()
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    return { success: true, data: await this.vendorRfqsService.supplierFindAll(user) };
  }

  @Get(':id')
  async findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return { success: true, data: await this.vendorRfqsService.supplierFindOne(user, id) };
  }

  @Post(':id/quote')
  async submitQuote(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: SubmitQuoteDto) {
    return { success: true, data: await this.supplierQuotesService.submitQuote(user, id, dto) };
  }

  @Post(':id/cannot-supply')
  async cannotSupply(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: CannotSupplyDto) {
    return { success: true, data: await this.supplierQuotesService.cannotSupply(user, id, dto.remarks) };
  }

  @Post(':id/partial-supply')
  async partialSupply(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: SubmitQuoteDto) {
    return { success: true, data: await this.supplierQuotesService.submitPartialSupply(user, id, dto) };
  }
}
