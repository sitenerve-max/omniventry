import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsBoolean, IsIn, IsInt, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';
import { VendorRfqStatus } from '@prisma/client';

export class SubmitQuoteItemDto {
  @IsString()
  rfqItemId!: string;

  @IsString()
  mpn!: string;

  @IsInt()
  @IsPositive()
  availableQuantity!: number;

  @IsPositive()
  unitPrice!: number;

  @IsInt()
  @IsPositive()
  moq!: number;

  @IsString()
  dateCode!: string;

  @IsString()
  packaging!: string;

  @IsString()
  leadTime!: string;

  @IsOptional()
  @IsString()
  warranty?: string;

  @IsOptional()
  @IsString()
  countryOfOrigin?: string;

  @IsOptional()
  @IsBoolean()
  certificateAvailable?: boolean;

  @IsString()
  condition!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class SubmitQuoteDto {
  @IsOptional()
  @IsIn(['INR', 'USD'])
  currency?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SubmitQuoteItemDto)
  items!: SubmitQuoteItemDto[];
}

export class CannotSupplyDto {
  @IsOptional()
  @IsString()
  remarks?: string;
}

export class UpdateVendorRfqStatusDto {
  @IsIn(Object.values(VendorRfqStatus))
  status!: VendorRfqStatus;
}
