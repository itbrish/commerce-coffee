# Database Entity Relationship & Design

## Key Entities
- **User**: Admin, Sales, Warehouse, and Customer Service accounts with RBAC.
- **Product**: Core machine attributes, SKU, Price (`Decimal`), Stock, ReservedStock, BoilerType, PumpType, PowerWatts, WaterTankLitres, GroupHeads, Dimensions.
- **ProductSpecification**: Key-value technical specifications grouped by category (Thermal System, Performance, Build, Ergonomics).
- **ProductImage**: High-resolution gallery images with primary flag and display ordering.
- **InventoryMovement**: Immutable ledger of inventory changes (`PURCHASE`, `SALE`, `RESERVATION`, `RELEASE`, `ADJUSTMENT`).
- **Order & OrderItem**: Order details, white-glove delivery address, order state machine, payment status.
- **WhatsAppLead**: Tracks inbound leads from product detail and cart checkout clicks.
- **CMSPage & CMSSection**: Dynamic homepage section management without code deployment.
