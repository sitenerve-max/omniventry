import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleName } from '@prisma/client';
import { CurrentUser, AuthenticatedUser, JwtAuthGuard, Roles, RolesGuard } from '../auth/guards';
import { CustomerQuotationsService } from './customer-quotations.service';
import { CreateCustomerQuotationDto, NegotiateQuotationDto, UpdateCustomerQuotationStatusDto } from './dto';

const ADMIN_ROLES = [
  RoleName.SUPER_ADMIN,
  RoleName.ADMIN,
  RoleName.SALES_MANAGER,
  RoleName.SALES_EXECUTIVE,
  RoleName.FINANCE_MANAGER,
];

@ApiTags('admin-customer-quotations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(...ADMIN_ROLES)
@Controller('api/admin/customer-quotations')
export class AdminCustomerQuotationsController {
  constructor(private readonly service: CustomerQuotationsService) {}

  @Post()
  async create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateCustomerQuotationDto) {
    return { success: true, data: await this.service.adminCreate(dto, user.userId) };
  }

  @Get()
  async findAll() {
    return { success: true, data: await this.service.adminFindAll() };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return { success: true, data: await this.service.adminFindOne(id) };
  }

  @Patch(':id')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateCustomerQuotationStatusDto) {
    return { success: true, data: await this.service.adminUpdateStatus(id, dto.status) };
  }
}

@ApiTags('customer-quotations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.CUSTOMER, RoleName.ENTERPRISE_CUSTOMER)
@Controller('api/customer/quotations')
export class CustomerQuotationsController {
  constructor(private readonly service: CustomerQuotationsService) {}

  @Get()
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    return { success: true, data: await this.service.customerFindAll(user) };
  }

  @Get(':id')
  async findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return { success: true, data: await this.service.customerFindOne(user, id) };
  }

  @Post(':id/accept')
  async accept(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return { success: true, data: await this.service.accept(user, id) };
  }

  @Post(':id/reject')
  async reject(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return { success: true, data: await this.service.reject(user, id) };
  }

  @Post(':id/negotiate')
  async negotiate(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: NegotiateQuotationDto) {
    return { success: true, data: await this.service.negotiate(user, id, dto) };
  }
}
