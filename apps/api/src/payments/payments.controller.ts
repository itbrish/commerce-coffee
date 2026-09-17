import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create-intent')
  @ApiOperation({ summary: 'Create live payment token/intent (Midtrans Snap / Xendit)' })
  async createIntent(@Body() body: { orderId: string }) {
    return this.paymentsService.createPaymentIntent(body.orderId);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Payment Gateway Webhook notification handler' })
  async handleWebhook(@Body() payload: any) {
    return this.paymentsService.handleWebhook(payload);
  }
}