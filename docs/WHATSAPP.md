# WhatsApp Integration & Business API

## Architecture
The system supports both direct `wa.me` customer-assisted workflows and automated WhatsApp notifications through `WhatsAppProvider` abstraction.

### Environment Configuration
```env
WHATSAPP_PROVIDER="meta"
WHATSAPP_PHONE_NUMBER_ID="your_phone_number_id"
WHATSAPP_ACCESS_TOKEN="your_meta_cloud_token"
WHATSAPP_BUSINESS_ACCOUNT_ID="your_waba_id"
NEXT_PUBLIC_WHATSAPP_NUMBER="6281234567890"
```
