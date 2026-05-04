import { IsString, IsOptional, IsBoolean, Length } from 'class-validator';

export class CreateMenuCategoryDto {
  @IsString()
  @Length(1, 100)
  name!: string;

  @IsString()
  @IsOptional()
  @Length(0, 300)
  description?: string;

  @IsBoolean()
  @IsOptional()
  isVisible?: boolean = true;
}

export class UpdateMenuCategoryDto {
  @IsString()
  @IsOptional()
  @Length(1, 100)
  name?: string;

  @IsString()
  @IsOptional()
  @Length(0, 300)
  description?: string;

  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;
}

export class ReorderCategoriesDto {
  categories!: { id: string; sortOrder: number }[];
}
