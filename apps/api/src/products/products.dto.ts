import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  slug!: string;

  @IsNotEmpty()
  @IsString()
  sku!: string;

  @IsNotEmpty()
  @IsString()
  brandId!: string;

  @IsNotEmpty()
  @IsString()
  categoryId!: string;

  @IsNotEmpty()
  @IsString()
  shortDescription!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsNumber()
  price!: number;

  @IsOptional()
  @IsNumber()
  compareAtPrice?: number;

  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsBoolean()
  bestseller?: boolean;

  @IsOptional()
  @IsBoolean()
  newArrival?: boolean;

  @IsOptional()
  @IsBoolean()
  requiresConsultation?: boolean;

  @IsOptional()
  @IsBoolean()
  whatsappEnabled?: boolean;

  @IsOptional()
  @IsString()
  boilerType?: string;

  @IsOptional()
  @IsString()
  pumpType?: string;

  @IsOptional()
  @IsNumber()
  powerWatts?: number;

  @IsOptional()
  @IsString()
  voltage?: string;

  @IsOptional()
  @IsNumber()
  waterTankLitres?: number;

  @IsOptional()
  @IsNumber()
  groupHeads?: number;

  @IsOptional()
  @IsString()
  dimensions?: string;

  @IsOptional()
  @IsString()
  usageType?: string;

  @IsOptional()
  @IsArray()
  images?: Array<{ url: string; isPrimary?: boolean; order?: number }>;

  @IsOptional()
  @IsArray()
  specifications?: Array<{ name: string; value: string; group?: string; order?: number }>;
}
