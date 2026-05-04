import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FulfillmentType } from '@mesa/shared-types';

class ItemModifierDto {
  @IsString()
  groupName: string;

  @IsString({ each: true })
  options: string[];
}

class ItemSummaryDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsNumber()
  @Min(0)
  totalPrice: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemModifierDto)
  modifiers?: ItemModifierDto[];
}

export class CreateOrderLeadDto {
  @IsString()
  customerName: string;

  @IsOptional()
  @IsString()
  customerPhone?: string | null;

  @IsEnum(FulfillmentType)
  fulfillmentType: FulfillmentType;

  @IsOptional()
  @IsString()
  tableNumber?: string | null;

  @IsOptional()
  @IsString()
  address?: string | null;

  @IsOptional()
  @IsString()
  deliveryZoneId?: string | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemSummaryDto)
  itemsSummary: ItemSummaryDto[];

  @IsNumber()
  @Min(0)
  subtotal: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  deliveryFee?: number | null;

  @IsNumber()
  @Min(0)
  total: number;

  @IsOptional()
  @IsString()
  preferredPaymentMethod?: string | null;

  @IsOptional()
  @IsString()
  note?: string | null;

  @IsString()
  whatsappMessage: string;
}
