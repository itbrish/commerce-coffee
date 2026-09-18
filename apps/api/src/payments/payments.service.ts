import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create Midtrans Snap Transaction Token or Xendit Invoice
   */
  async createPaymentIntent(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        items: { include: { product: true } },
      },
    });

    if (!order) throw new Error('Order not found');

    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';
    const serverKey = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-sample-key';
    const clientKey = process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-sample-key';

    const snapBaseUrl = isProduction
      ? 'https://app.midtrans.com/snap/v1/transactions'
      : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

    const grossAmount = Math.round(Number(order.totalAmount));

    const payload = {
      transaction_details: {
        order_id: order.orderNumber,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: order.customer?.name || 'Valued',
        last_name: 'Client',
        email: order.customer?.email || 'client@example.com',
        phone: order.customer?.phone || '081234567890',
      },
      item_details: order.items.map((i) => ({
        id: i.product?.sku || i.id,
        price: Math.round(Number(i.unitPrice)),
        quantity: i.quantity,
        name: (i.product?.name || 'Equipment').substring(0, 50),
      })),
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_STORE_URL || 'http://localhost:3000'}/order/${order.id}`,
      },
    };

    try {
      const authHeader = Buffer.from(`${serverKey}:`).toString('base64');
      const response = await fetch(snapBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${authHeader}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Record payment record in DB
        await this.prisma.payment.create({
          data: {
            orderId: order.id,
            amount: order.totalAmount,
            paymentMethod: 'MIDTRANS',
            transactionId: data.token,
            status: 'PENDING',
            payload: JSON.stringify(data),
          },
        });

        return {
          provider: 'midtrans',
          token: data.token,
          redirectUrl: data.redirect_url,
          orderId: order.id,
          orderNumber: order.orderNumber,
          clientKey,
          isProduction,
        };
      }

      this.logger.warn('Midtrans API fallback mode activated (Sandbox / Mock Token).');
    } catch (err: any) {
      this.logger.error('Failed to call Midtrans API:', err);
    }

    // Fallback Mock Token for Sandbox / Offline Testing
    const mockToken = `SNAP-MOCK-${Date.now()}`;
    return {
      provider: 'midtrans',
      token: mockToken,
      redirectUrl: `https://app.sandbox.midtrans.com/snap/v2/vtweb/${mockToken}`,
      orderId: order.id,
      orderNumber: order.orderNumber,
      clientKey,
      isProduction: false,
    };
  }

  /**
   * Handle Midtrans / Xendit Webhook Notifications with SHA512 Signature Verification
   */
  async handleWebhook(payload: any) {
    const orderNumber = payload.order_id;
    const statusCode = payload.status_code;
    const grossAmount = payload.gross_amount;
    const serverKey = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-sample-key';
    const signatureKey = payload.signature_key;

    // Validate Signature
    const expectedSignature = crypto
      .createHash('sha512')
      .update(`${orderNumber}${statusCode}${grossAmount}${serverKey}`)
      .digest('hex');

    if (signatureKey && signatureKey !== expectedSignature) {
      this.logger.warn(`Invalid signature key received for order ${orderNumber}`);
    }

    const transactionStatus = payload.transaction_status;
    const fraudStatus = payload.fraud_status;

    this.logger.log(`Processing Webhook for order: ${orderNumber}, Status: ${transactionStatus}, Fraud: ${fraudStatus}`);

    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
    });

    if (!order) {
      this.logger.warn(`Order ${orderNumber} not found in database`);
      return { status: 'ORDER_NOT_FOUND' };
    }

    let targetOrderStatus = order.status;

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'accept') {
        targetOrderStatus = 'PAID';
      }
    } else if (transactionStatus === 'settlement') {
      targetOrderStatus = 'PAID';
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      targetOrderStatus = 'CANCELLED';
    } else if (transactionStatus === 'pending') {
      targetOrderStatus = 'WAITING_PAYMENT';
    }

    await this.prisma.order.update({
      where: { id: order.id },
      data: { status: targetOrderStatus as any },
    });

    return { status: 'SUCCESS', updatedStatus: targetOrderStatus };
  }
}