import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsIn, IsInt, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';

export class RfqLineItemDto {
  @IsString()
  mpn!: string;

  @IsString()
  manufacturer!: string;

  @IsInt()
  @IsPositive()
  requiredQuantity!: number;

  @IsOptional()
  targetPriceInr?: number;

  @IsOptional()
  @IsString()
  packagingRequirement?: string;

  @IsOptional()
  @IsString()
  dateCodeRequirement?: string;

  @IsOptional()
  @IsString()
  qualityRequirement?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateRfqDto {
  @IsOptional()
  @IsString()
  requiredDate?: string;

  @IsString()
  deliveryLocation!: string;

  @IsOptional()
  @IsIn(['INR', 'USD'])
  currency?: string;

  @IsOptional()
  @IsString()
  paymentTerms?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RfqLineItemDto)
  lineItems!: RfqLineItemDto[];
}

export class UpdateRfqDto {
  @IsOptional()
  @IsString()
  requiredDate?: string;

  @IsOptional()
  @IsString()
  deliveryLocation?: string;

  @IsOptional()
  @IsIn(['INR', 'USD'])
  currency?: string;

  @IsOptional()
  @IsString()
  paymentTerms?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
