import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  async sendOrderConfirmation(order: any) {
    console.log('Order confirmation email event queued for: ' + order.customerEmail);
  }

  async sendWhatsAppNotification(to: string, message: string) {
    console.log('WhatsApp Notification dispatched to ' + to);
  }
}
