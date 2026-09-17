export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  SALES = "SALES",
  WAREHOUSE = "WAREHOUSE",
  CUSTOMER_SERVICE = "CUSTOMER_SERVICE",
  CONTENT_EDITOR = "CONTENT_EDITOR"
}

export enum OrderStatus {
  PENDING = "PENDING",
  WAITING_PAYMENT = "WAITING_PAYMENT",
  PAID = "PAID",
  PROCESSING = "PROCESSING",
  READY_TO_SHIP = "READY_TO_SHIP",
  SHIPPED = "SHIPPED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED"
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  EXPIRED = "EXPIRED",
  REFUNDED = "REFUNDED"
}

export enum InventoryMovementType {
  PURCHASE = "PURCHASE",
  SALE = "SALE",
  RESERVATION = "RESERVATION",
  RELEASE = "RELEASE",
  ADJUSTMENT = "ADJUSTMENT",
  RETURN = "RETURN"
}

export enum WhatsAppLeadSource {
  PRODUCT_PAGE = "PRODUCT_PAGE",
  CART = "CART",
  DIRECT_CONSULTATION = "DIRECT_CONSULTATION",
  COMMERCIAL_INQUIRY = "COMMERCIAL_INQUIRY"
}

export interface ProductSpecification {
  id: string;
  name: string;
  value: string;
  category?: string;
  group?: string;
  order: number;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
  order: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  countryOfOrigin?: string;
  foundedYear?: number;
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  featured: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brandId: string;
  brand?: Brand;
  categoryId: string;
  category?: Category;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stock: number;
  reservedStock: number;
  weight: number; // in grams
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  requiresConsultation: boolean;
  whatsappEnabled: boolean;
  images: ProductImage[];
  specifications: ProductSpecification[];
  highlights?: string[];
  features?: string[];
  warrantyInfo?: string;
  boilerType?: string;
  pumpType?: string;
  powerWatts?: number;
  voltage?: string;
  waterTankLitres?: number;
  groupHeads?: number;
  dimensions?: string;
  usageType?: "HOME" | "COMMERCIAL" | "DUAL";
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  totalDiscount: number;
  estimatedShipping: number;
  grandTotal: number;
}

export interface CustomerAddress {
  id?: string;
  fullName: string;
  phone: string;
  streetAddress: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  whatsappNumber?: string;
  shippingAddress: CustomerAddress;
  shippingMethodName: string;
  shippingCost: number;
  trackingNumber?: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WhatsAppLead {
  id: string;
  customerName?: string;
  phone?: string;
  productId?: string;
  productName?: string;
  source: WhatsAppLeadSource;
  notes?: string;
  createdAt: string;
}

export interface CMSSection {
  id: string;
  key: string;
  title: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  order: number;
  isActive: boolean;
  metaData?: Record<string, any>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}