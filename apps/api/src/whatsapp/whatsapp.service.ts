import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);

  constructor(private prisma: PrismaService) {}

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  /**
   * Send live WhatsApp message via Meta Cloud API (Official WhatsApp Business API)
   */
  async sendMetaCloudMessage(to: string, messageText: string): Promise<any> {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

    if (!phoneNumberId || !accessToken) {
      this.logger.warn('WhatsApp Cloud API credentials (WHATSAPP_PHONE_NUMBER_ID / ACCESS_TOKEN) not configured.');
      return { success: false, reason: 'Credentials not configured' };
    }

    // Clean phone number (strip +, spaces, dashes; ensure country code e.g. 628...)
    let cleanPhone = to.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }

    const endpoint = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: cleanPhone,
          type: 'text',
          text: { preview_url: true, body: messageText },
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        this.logger.error('Meta WhatsApp API Error:', result);
        return { success: false, error: result };
      }

      this.logger.log(`WhatsApp message sent successfully to ${cleanPhone}`);
      return { success: true, result };
    } catch (err: any) {
      this.logger.error('Failed to dispatch Meta WhatsApp message:', err);
      return { success: false, error: err.message };
    }
  }

  async generateProductInquiry(productId: string, customerName?: string, phone?: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { brand: true },
    });

    if (!product) throw new Error('Product not found');

    const formattedPrice = this.formatCurrency(Number(product.price));
    const storeUrl = process.env.NEXT_PUBLIC_STORE_URL || 'https://ateliercoffee.co';
    const productUrl = storeUrl + '/product/' + product.slug;

    const message = `Halo Atelier du Café, saya tertarik dengan produk:\n\n*${product.name}*\nSKU: ${product.sku}\nHarga: ${formattedPrice}\nBrand: ${product.brand?.name || 'Artisanal'}\nLink: ${productUrl}\n\nMohon informasi ketersediaan unit, opsi instalasi, dan konsultasi spesifikasi. Terima kasih.`;

    const lead = await this.prisma.whatsAppLead.create({
      data: {
        customerName: customerName || 'Prospective Client',
        phone: phone || null,
        productId: product.id,
        source: 'PRODUCT_PAGE',
        message,
      },
    });

    const targetPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890';
    const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;

    // Dispatch Meta Cloud notification if enabled
    if (process.env.WHATSAPP_PROVIDER === 'meta' && phone) {
      await this.sendMetaCloudMessage(targetPhone, `[NEW PRODUCT LEAD] ${customerName || 'Customer'} inquired about ${product.name}`);
    }

    return {
      leadId: lead.id,
      message,
      targetPhone,
      waUrl,
    };
  }

  async generateCartOrder(sessionId: string, customerInfo?: { name: string; phone: string; address?: string }) {
    const cart = await this.prisma.cart.findUnique({
      where: { sessionId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    let subtotal = 0;
    let itemListText = '';

    cart.items.forEach((item, index) => {
      const price = Number(item.unitPrice);
      const total = price * item.quantity;
      subtotal += total;
      itemListText += `${index + 1}. *${item.product.name}*\n   Qty: ${item.quantity} x ${this.formatCurrency(price)} = ${this.formatCurrency(total)}\n`;
    });

    const message = `Halo Atelier du Café, saya ingin melakukan pemesanan equipment via WhatsApp:\n\n${itemListText}\n*Estimasi Subtotal: ${this.formatCurrency(subtotal)}*\n\nNama: ${customerInfo?.name || '-'}\nNo. Telp / WA: ${customerInfo?.phone || '-'}\nAlamat Pengiriman: ${customerInfo?.address || 'Akan diinformasikan'}\n\nMohon dibantu konfirmasi pesanan dan instruksi pembayaran. Terima kasih.`;

    const lead = await this.prisma.whatsAppLead.create({
      data: {
        customerName: customerInfo?.name || 'Cart Customer',
        phone: customerInfo?.phone || null,
        source: 'CART',
        message,
      },
    });

    const targetPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890';
    const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;

    return {
      leadId: lead.id,
      message,
      waUrl,
    };
  }

  async getLeads() {
    return this.prisma.whatsAppLead.findMany({
      orderBy: { createdAt: 'desc' },
      include: { product: { select: { name: true, sku: true } } },
      take: 50,
    });
  }
}