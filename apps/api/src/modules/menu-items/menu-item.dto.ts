import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  Length,
  Min,
} from 'class-validator';

export class CreateMenuItemDto {
  @IsString()
  categoryId!: string;

  @IsString()
  @Length(1, 100)
  name!: string;

  @IsString()
  @IsOptional()
  @Length(0, 500)
  description?: string;

  @IsNumber()
  @Min(0)
  basePrice!: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isVisible?: boolean = true;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean = true;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

export class UpdateMenuItemDto {
  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  @Length(1, 100)
  name?: string;

  @IsString()
  @IsOptional()
  @Length(0, 500)
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  basePrice?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

export class ReorderItemsDto {
  items!: { id: string; sortOrder: number }[];
}
