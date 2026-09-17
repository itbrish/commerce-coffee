# API Endpoints Specification (REST / OpenAPI)

Base URL: `/api/v1`
Interactive Swagger Documentation: `http://localhost:4000/api/docs`

### Authentication (`/auth`)
- `POST /auth/login` — Admin & staff login (Returns JWT token).
- `POST /auth/register` — Register staff user.

### Products (`/products`)
- `GET /products` — Paginated catalog with multi-facet filters (`category`, `brand`, `boilerType`, `usageType`, `search`, `sortBy`).
- `GET /products/:slug` — Product detail with full technical specs, image gallery, and recommendations.
- `POST /products` — Create product with specs & images (Admin).
- `PUT /products/:id` — Update product details.
- `DELETE /products/:id` — Soft-delete product.

### Cart (`/cart`)
- `GET /cart?sessionId=...` — Retrieve current session cart.
- `POST /cart/items` — Add item to cart.
- `DELETE /cart/items/:id` — Remove item from cart.

### Orders (`/orders`)
- `POST /orders` — Atomic checkout order creation with inventory reservation.
- `GET /orders` — List orders (Admin).
- `GET /orders/:id` — Order status and fulfillment details.
- `PATCH /orders/:id/status` — Update order status (`SHIPPED`, `COMPLETED`).

### WhatsApp (`/whatsapp`)
- `POST /whatsapp/inquire-product` — Generate pre-filled single product message & track lead.
- `POST /whatsapp/cart-checkout` — Generate pre-filled cart order message & track lead.
- `GET /whatsapp/leads` — List recorded consultation leads (Admin).

### Inventory (`/inventory`)
- `GET /inventory/movements` — Audit trail of stock movements.
- `POST /inventory/adjust` — Manual warehouse stock adjustment.

### CMS (`/cms`)
- `GET /cms/pages/:slug` — Get page with active sections.
- `PUT /cms/sections/:id` — Update section content (Hero, Stories, Commercial).
