import { Controller, Get, Post, Body, Query, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WhatsAppService } from './whatsapp.service';

@ApiTags('WhatsApp')
@Controller('whatsapp')
export class WhatsAppController {
  constructor(private whatsappService: WhatsAppService) {}

  @Post('inquire-product')
  @ApiOperation({ summary: 'Generate formatted product WhatsApp inquiry & track lead' })
  async inquireProduct(
    @Body() body: { productId: string; customerName?: string; phone?: string },
  ) {
    return this.whatsappService.generateProductInquiry(
      body.productId,
      body.customerName,
      body.phone,
    );
  }

  @Post('cart-checkout')
  @ApiOperation({ summary: 'Generate formatted cart order WhatsApp quotation' })
  async cartCheckout(
    @Body() body: { sessionId: string; customerInfo?: { name: string; phone: string; address?: string } },
  ) {
    return this.whatsappService.generateCartOrder(body.sessionId, body.customerInfo);
  }

  @Get('leads')
  @ApiOperation({ summary: 'List all recorded WhatsApp inquiries for sales team' })
  async getLeads() {
    return this.whatsappService.getLeads();
  }

  @Get('webhook')
  @ApiOperation({ summary: 'Meta Webhook Verification endpoint' })
  verifyWebhook(@Query() query: any) {
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'atelier-du-cafe-verify-token-2026';

    if (mode === 'subscribe' && token === verifyToken) {
      return challenge;
    }
    return 'Invalid verify token';
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Meta Webhook receiver for incoming messages' })
  async handleIncomingWebhook(@Body() body: any) {
    // Process incoming WhatsApp message from Meta
    if (body.object && body.entry) {
      for (const entry of body.entry) {
        for (const change of entry.changes || []) {
          const value = change.value;
          if (value?.messages) {
            for (const msg of value.messages) {
              const senderPhone = msg.from;
              const text = msg.text?.body || '[Media/Interactive]';
              console.log(`[INBOUND WHATSAPP] From: ${senderPhone}, Message: ${text}`);
            }
          }
        }
      }
    }
    return { status: 'EVENT_RECEIVED' };
  }
}