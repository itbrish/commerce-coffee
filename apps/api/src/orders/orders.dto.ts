import { IsNotEmpty, IsString, IsEmail, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsNotEmpty()
  @IsString()
  productId!: string;

  @IsNotEmpty()
  quantity!: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  customerName!: string;

  @IsNotEmpty()
  @IsEmail()
  customerEmail!: string;

  @IsNotEmpty()
  @IsString()
  customerPhone!: string;

  @IsOptional()
  @IsString()
  whatsappNumber?: string;

  @IsNotEmpty()
  @IsString()
  streetAddress!: string;

  @IsNotEmpty()
  @IsString()
  province!: string;

  @IsNotEmpty()
  @IsString()
  city!: string;

  @IsNotEmpty()
  @IsString()
  district!: string;

  @IsNotEmpty()
  @IsString()
  postalCode!: string;

  @IsOptional()
  @IsString()
  shippingMethodName?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
