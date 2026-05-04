import {
  IsString,
  IsOptional,
  IsBoolean,
  IsUrl,
  Length,
} from 'class-validator';

export class CreatePaymentMethodDto {
  @IsString()
  @Length(1, 100)
  type!: string;

  @IsString()
  @Length(1, 100)
  name!: string;

  @IsString()
  @IsOptional()
  @Length(0, 500)
  details?: string;

  @IsUrl()
  @IsOptional()
  qrImageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}

export class UpdatePaymentMethodDto {
  @IsString()
  @IsOptional()
  @Length(1, 100)
  type?: string;

  @IsString()
  @IsOptional()
  @Length(1, 100)
  name?: string;

  @IsString()
  @IsOptional()
  @Length(0, 500)
  details?: string;

  @IsUrl()
  @IsOptional()
  qrImageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
