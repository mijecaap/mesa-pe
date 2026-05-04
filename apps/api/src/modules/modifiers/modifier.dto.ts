import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsInt,
  Length,
  Min,
} from 'class-validator';

export class CreateModifierGroupDto {
  @IsString()
  @Length(1, 100)
  name!: string;

  @IsBoolean()
  @IsOptional()
  isRequired?: boolean = false;

  @IsString()
  @IsOptional()
  selectionType?: string = 'SINGLE';

  @IsInt()
  @IsOptional()
  @Min(0)
  minSelections?: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  maxSelections?: number;
}

export class UpdateModifierGroupDto {
  @IsString()
  @IsOptional()
  @Length(1, 100)
  name?: string;

  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;

  @IsString()
  @IsOptional()
  selectionType?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  minSelections?: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  maxSelections?: number;
}

export class CreateModifierOptionDto {
  @IsString()
  @Length(1, 100)
  name!: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  priceDelta?: number = 0;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean = true;
}

export class UpdateModifierOptionDto {
  @IsString()
  @IsOptional()
  @Length(1, 100)
  name?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  priceDelta?: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
