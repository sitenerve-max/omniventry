import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser, AuthenticatedUser, JwtAuthGuard } from '../auth/guards';
import { RfqsService } from './rfqs.service';
import { CreateRfqDto, UpdateRfqDto } from './dto';

@ApiTags('rfqs')
@UseGuards(JwtAuthGuard)
@Controller('api/rfqs')
export class RfqsController {
  constructor(private readonly rfqsService: RfqsService) {}

  @Post()
  async create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateRfqDto) {
    return { success: true, data: await this.rfqsService.create(user, dto) };
  }

  @Get()
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    return { success: true, data: await this.rfqsService.findAll(user) };
  }

  @Get(':id')
  async findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return { success: true, data: await this.rfqsService.findOne(user, id) };
  }

  @Patch(':id')
  async update(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: UpdateRfqDto) {
    return { success: true, data: await this.rfqsService.update(user, id, dto) };
  }

  @Post(':id/submit')
  async submit(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return { success: true, data: await this.rfqsService.submit(user, id) };
  }

  @Post(':id/cancel')
  async cancel(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return { success: true, data: await this.rfqsService.cancel(user, id) };
  }
}
