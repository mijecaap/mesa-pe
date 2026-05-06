import { IsString, IsOptional, IsUrl, Length } from 'class-validator';

export class CreateUpgradeRequestDto {
  @IsString()
  requestedPlan!: string;

  @IsString()
  paymentMethod!: string;

  @IsUrl()
  @IsOptional()
  receiptUrl?: string;
}

export class ApproveUpgradeRequestDto {
  @IsString()
  @IsOptional()
  @Length(0, 500)
  notes?: string;
}

export class RejectUpgradeRequestDto {
  @IsString()
  @Length(1, 500)
  notes!: string;
}
