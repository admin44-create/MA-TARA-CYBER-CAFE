import { Customer, Order, Service, SiteSettings } from '../types';

/**
 * Format a phone number for WhatsApp API (e.g. cleans spaces/dashes, prepends 91 for India if missing)
 */
export function formatWhatsAppNumber(phone: string): string {
  if (!phone) return '919876543210';
  const clean = phone.replace(/[^0-9]/g, '');
  if (clean.length === 10) {
    return `91${clean}`;
  }
  return clean;
}

/**
 * Generates an official WhatsApp Click-to-Chat API URL
 */
export function getWhatsAppChatUrl(phone: string, text: string): string {
  const formattedPhone = formatWhatsAppNumber(phone);
  const encodedText = encodeURIComponent(text);
  return `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedText}`;
}

/**
 * Build pre-filled message for an Order confirmation & invoice sharing
 */
export function buildOrderConfirmationMessage(order: Order, siteName: string): string {
  return `*${siteName} - Order Confirmation Receipt* 📄
-----------------------------------------
✅ *Order ID:* ${order.id}
🧾 *Invoice No:* ${order.invoiceNumber}
👤 *Customer:* ${order.customerName} (ID: ${order.customerCode})
📱 *Phone:* ${order.customerPhone}

📦 *Service Ordered:* ${order.serviceTitle}
🔢 *Quantity:* ${order.quantity} card(s)
💰 *Total Paid:* ₹${order.totalAmount} (via UPI)
🔖 *Payment UTR No:* ${order.payment.utrNumber}
📊 *Current Status:* ${order.status}

📍 *Delivery Address:*
${order.shippingAddress.fullAddress},
${order.shippingAddress.district}, ${order.shippingAddress.state} - ${order.shippingAddress.pinCode}

${order.tracking?.trackingNumber ? `🚚 *Speed Post Consignment:* ${order.tracking.trackingNumber}\nPartner: ${order.tracking.courierPartner}\n` : ''}
Please verify my order and dispatch via Speed Post. Thank you!`;
}

/**
 * Build pre-filled message when inquiring about a specific Service
 */
export function buildServiceInquiryMessage(service: Service, siteName: string, customer?: Customer | null): string {
  const customerInfo = customer ? `\nMy Customer ID: ${customer.customerCode} (${customer.fullName})` : '';
  const docs = service.requiredDocs && service.requiredDocs.length > 0 
    ? `\n*Documents required:* ${service.requiredDocs.join(', ')}` 
    : '';

  return `Hello *${siteName}* Support Team, 👋
I want to enquire about / apply for:
👉 *${service.title}*
💰 *Fee:* ₹${service.price}
⏱️ *Turnaround Time:* ${service.turnaroundTime}
${docs}${customerInfo}

Kindly guide me on how to proceed or assist me with this online service.`;
}

/**
 * Build pre-filled message for tracking an order
 */
export function buildTrackingInquiryMessage(trackingOrOrderId: string, siteName: string, customer?: Customer | null): string {
  const customerInfo = customer ? `\nMy Registered Phone: ${customer.phone}` : '';
  return `Hello *${siteName}* Team, 🚚
I want to track my PVC Card order / parcel.
👉 *Tracking / Order ID:* ${trackingOrOrderId}${customerInfo}

Please share the current delivery status and Speed Post consignment update.`;
}

/**
 * Build pre-filled message for Admin notifying a customer on WhatsApp
 */
export function buildAdminCustomerAlertMessage(
  order: Order, 
  status: string, 
  siteSettings: SiteSettings,
  note?: string
): string {
  const trackingInfo = order.tracking?.trackingNumber 
    ? `\n🚚 *Speed Post Consignment No:* ${order.tracking.trackingNumber}\nPartner: ${order.tracking.courierPartner}\nEstimated Delivery: ${order.tracking.estimatedDelivery || '3-4 working days'}`
    : '';

  return `*Update from ${siteSettings.siteName}* 📢
Dear ${order.customerName},

Your order status has been updated:
📌 *Order ID:* ${order.id}
📑 *Service:* ${order.serviceTitle}
⚡ *New Status:* *${status}*
${trackingInfo}
${note ? `\n📝 *Note:* ${note}` : ''}

Track your order anytime at: ${siteSettings.siteName} Portal with your Customer ID: *${order.customerCode}*
For help, reply to this WhatsApp message!`;
}
