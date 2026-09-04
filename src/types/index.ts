export type ServiceCategory = 'pvc_card' | 'document' | 'certificate' | 'utility';

export interface Service {
  id: string;
  title: string;
  category: ServiceCategory;
  price: number;
  turnaroundTime: string;
  description: string;
  requiredDocs: string[];
  iconName: string;
  popular?: boolean;
  active: boolean;
  badge?: string;
  sampleImageUrl?: string;
}

export interface Customer {
  id: string;
  customerCode: string; // e.g. "EZ-749201"
  fullName: string;
  phone: string;
  email: string;
  state: string;
  district: string;
  pinCode: string;
  address: string;
  createdAt: string;
  password?: string;
}

export type OrderStatus = 'Pending' | 'Payment Verified' | 'Printing' | 'Dispatched' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface TrackingStep {
  status: string;
  date: string;
  location: string;
  note: string;
  completed: boolean;
}

export interface OrderTracking {
  trackingNumber: string;
  courierPartner: string;
  dispatchedAt?: string;
  estimatedDelivery?: string;
  currentLocation?: string;
  history: TrackingStep[];
}

export interface OrderPayment {
  status: 'Pending' | 'Verified' | 'Failed';
  method: 'UPI_QR' | 'UPI_ID';
  utrNumber: string; // 12-digit UPI reference number
  slipUrl?: string;
  paidAt: string;
  verifiedAt?: string;
}

export interface Order {
  id: string; // e.g. "ORD-98241"
  invoiceNumber: string; // e.g. "INV-2026-98241"
  customerId: string;
  customerCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceId: string;
  serviceTitle: string;
  serviceCategory: ServiceCategory;
  servicePrice: number;
  quantity: number;
  deliveryCharge: number;
  totalAmount: number;
  shippingAddress: {
    recipientName: string;
    phone: string;
    state: string;
    district: string;
    pinCode: string;
    fullAddress: string;
  };
  orderNotes?: string;
  documentNumber?: string; // Aadhaar, Voter, or PAN No
  uploadedDocumentName?: string;
  uploadedDocumentUrl?: string;
  status: OrderStatus;
  payment: OrderPayment;
  tracking?: OrderTracking;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoUrl: string;
  bannerHeadline: string;
  bannerSubheadline: string;
  bannerImageUrl: string;
  bannerBadge: string;
  noticeText: string;
  contactPhone: string;
  contactEmail: string;
  contactWhatsApp: string;
  supportHours: string;
  officeAddress: string;
  upiId: string;
  upiMerchantName: string;
  upiQrImageUrl: string;
  gstNumber?: string;
  deliveryFeePerOrder: number;
}

export interface AdminAuditLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  ipOrDevice?: string;
}

export interface AdminSecuritySettings {
  adminUsername: string;
  password: string;
  securityPin: string; // 4-6 digit quick PIN
  twoFactorPinRequired: boolean;
  autoLockMinutes: number; // 0 for off, or 15, 30, 60
  lastPasswordChanged: string;
  lastLoginAt?: string;
  maxFailedAttempts: number;
}
