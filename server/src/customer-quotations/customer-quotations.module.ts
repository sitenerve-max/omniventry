import { Module } from '@nestjs/common';
import { AdminCustomerQuotationsController, CustomerQuotationsController } from './customer-quotations.controller';
import { CustomerQuotationsService } from './customer-quotations.service';

@Module({
  controllers: [AdminCustomerQuotationsController, CustomerQuotationsController],
  providers: [CustomerQuotationsService],
})
export class CustomerQuotationsModule {}
