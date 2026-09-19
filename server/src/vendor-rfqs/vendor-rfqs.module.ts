import { Module } from '@nestjs/common';
import { AdminVendorRfqsController, SupplierVendorRfqsController } from './vendor-rfqs.controller';
import { VendorRfqsService } from './vendor-rfqs.service';
import { SupplierQuotesService } from './supplier-quotes.service';

@Module({
  controllers: [AdminVendorRfqsController, SupplierVendorRfqsController],
  providers: [VendorRfqsService, SupplierQuotesService],
  exports: [VendorRfqsService, SupplierQuotesService],
})
export class VendorRfqsModule {}
