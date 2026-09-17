# Technical Architecture Documentation

## 1. Monorepo Principles
- **Decoupled Architecture**: Storefront (`apps/web`) and Admin (`apps/admin`) are pure API consumers and NEVER access the database directly.
- **Shared Domain Contracts**: `@coffee/types` packages ensure end-to-end type safety between backend DTOs and frontend components.

## 2. Order Transaction & Stock Reservation Machine
1. Customer initiates checkout with item IDs and quantities.
2. NestJS `OrdersService` initiates an atomic database transaction:
   - Validates live stock (`product.stock >= item.quantity`).
   - Decrements `product.stock` and increments `product.reservedStock`.
   - Records an immutable `InventoryMovement` entry with type `RESERVATION`.
   - Computes subtotal, free delivery qualification, and creates the `Order` + `OrderItem` rows.
   - Generates the payment intent.
   - If any step fails, the entire transaction is rolled back.

## 3. WhatsApp Assisted Sales Engine
High-ticket luxury coffee machines (Rp 30.000.000 – Rp 380.000.000) require high-touch human consultation.
- **Product Inquiry**: Generates pre-formatted WhatsApp URLs with product name, SKU, price, and store deep-link.
- **Cart Checkout**: Generates a structured multi-item quotation summary for direct WhatsApp closing.
- **Lead Tracking**: Each click is logged to `WhatsAppLead` table for conversion analytics.
