import {
  IsString,
  IsOptional,
  IsBoolean,
  IsUrl,
  Length,
  Matches,
  IsObject,
} from 'class-validator';

class BusinessThemeDto {
  @IsString()
  preset!: string;

  @IsString()
  primaryColor!: string;

  @IsString()
  backgroundColor!: string;

  @IsString()
  textColor!: string;

  @IsString()
  accentColor!: string;

  @IsString()
  fontFamily!: string;
}

export class CreateBusinessDto {
  @IsString()
  @Length(2, 50)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'El slug solo puede contener letras minúsculas, números y guiones',
  })
  slug!: string;

  @IsString()
  @Length(1, 100)
  name!: string;

  @IsString()
  @IsOptional()
  @Length(0, 500)
  description?: string;

  @IsString()
  @Length(8, 20)
  whatsappNumber!: string;

  @IsString()
  @IsOptional()
  @Length(0, 300)
  address?: string;

  @IsUrl()
  @IsOptional()
  googleMapsUrl?: string;

  @IsUrl()
  @IsOptional()
  instagramUrl?: string;

  @IsUrl()
  @IsOptional()
  tiktokUrl?: string;

  @IsUrl()
  @IsOptional()
  facebookUrl?: string;

  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @IsUrl()
  @IsOptional()
  bannerUrl?: string;

  @IsString()
  @IsOptional()
  currency?: string = 'PEN';

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean = false;

  @IsString()
  @IsOptional()
  manualStatus?: string = 'AUTO';

  @IsObject()
  @IsOptional()
  theme?: BusinessThemeDto;
}

export class UpdateBusinessDto {
  @IsString()
  @IsOptional()
  @Length(1, 100)
  name?: string;

  @IsString()
  @IsOptional()
  @Length(0, 500)
  description?: string;

  @IsString()
  @IsOptional()
  @Length(8, 20)
  whatsappNumber?: string;

  @IsString()
  @IsOptional()
  @Length(0, 300)
  address?: string;

  @IsUrl()
  @IsOptional()
  googleMapsUrl?: string;

  @IsUrl()
  @IsOptional()
  instagramUrl?: string;

  @IsUrl()
  @IsOptional()
  tiktokUrl?: string;

  @IsUrl()
  @IsOptional()
  facebookUrl?: string;

  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @IsUrl()
  @IsOptional()
  bannerUrl?: string;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsString()
  @IsOptional()
  manualStatus?: string;

  @IsObject()
  @IsOptional()
  theme?: BusinessThemeDto;
}
