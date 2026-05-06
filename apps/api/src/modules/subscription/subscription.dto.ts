import {
  IsString,
  IsOptional,
  IsDate,
  IsBoolean,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSubscriptionDto {
  @IsString()
  plan!: string;

  @IsDate()
  @Type(() => Date)
  endsAt!: Date;

  @IsString()
  @IsOptional()
  @Length(0, 500)
  notes?: string;

  @IsBoolean()
  @IsOptional()
  isTrial?: boolean = false;
}

export class UpdateSubscriptionDto {
  @IsString()
  @IsOptional()
  plan?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endsAt?: Date;

  @IsString()
  @IsOptional()
  @Length(0, 500)
  notes?: string;

  @IsBoolean()
  @IsOptional()
  isTrial?: boolean;
}
