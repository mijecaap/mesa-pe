import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsInt,
  Length,
  Min,
} from 'class-validator';

export class CreateDeliveryZoneDto {
  @IsString()
  @Length(1, 100)
  name!: string;

  @IsNumber()
  @Min(0)
  deliveryFee!: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  minimumOrderAmount?: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  estimatedMinutes?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}

export class UpdateDeliveryZoneDto {
  @IsString()
  @IsOptional()
  @Length(1, 100)
  name?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  deliveryFee?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  minimumOrderAmount?: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  estimatedMinutes?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
