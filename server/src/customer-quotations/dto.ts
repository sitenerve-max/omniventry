import { ArrayMinSize, IsArray, IsIn, IsOptional, IsString } from 'class-validator';
import { CustomerQuotationStatus } from '@prisma/client';

export class CreateCustomerQuotationDto {
  @IsString()
  rfqId!: string;

  @IsArray()
  @ArrayMinSize(1)
  supplierQuoteItemIds!: string[];

  @IsOptional()
  @IsString()
  validUntil?: string;
}

export class UpdateCustomerQuotationStatusDto {
  @IsIn(Object.values(CustomerQuotationStatus))
  status!: CustomerQuotationStatus;
}

export class NegotiateQuotationDto {
  @IsOptional()
  @IsString()
  note?: string;
}
