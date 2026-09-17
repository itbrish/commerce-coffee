# Payment Gateway Integration

## Abstraction Layer
`PaymentProvider` interface decoupling direct gateway dependencies:
- **Midtrans Snap**: Secure redirect & pop-up checkout for credit cards, GoPay, QRIS, and Virtual Accounts.
- **Xendit**: Invoicing and automated bank transfer reconciliation.
- **Manual Bank Transfer**: VIP corporate invoicing with white-glove technician confirmation.
