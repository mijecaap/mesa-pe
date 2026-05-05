import {
  IsString,
  IsOptional,
  IsBoolean,
  IsUrl,
  Length,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePromotionDto {
  @IsString()
  @Length(1, 120)
  title!: string;

  @IsString()
  @IsOptional()
  @Length(0, 500)
  description?: string;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsUrl()
  @IsOptional()
  ctaUrl?: string;

  @IsString()
  @IsOptional()
  @Length(0, 50)
  buttonText?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}

export class UpdatePromotionDto {
  @IsString()
  @IsOptional()
  @Length(1, 120)
  title?: string;

  @IsString()
  @IsOptional()
  @Length(0, 500)
  description?: string;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsUrl()
  @IsOptional()
  ctaUrl?: string;

  @IsString()
  @IsOptional()
  @Length(0, 50)
  buttonText?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
