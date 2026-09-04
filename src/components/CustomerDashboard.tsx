import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  CreditCard, 
  FileText, 
  Truck, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  Plus, 
  Barcode, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  MessageCircle,
  PackageCheck,
  Send
} from 'lucide-react';
import { getWhatsAppChatUrl, buildOrderConfirmationMessage } from '../utils/whatsapp';

export const CustomerDashboard: React.FC = () => {
  const { 
    currentUser, 
    orders, 
    siteSettings,
    openInvoiceForOrder, 
    openSpeedPostReceipt,
    openTrackingForOrder, 
    setCurrentView 
  } = useApp();

  const [copiedUtr, setCopiedUtr] = React.useState<string | null>(null);
  const [sentSmsOrderId, setSentSmsOrderId] = React.useState<string | null>(null);

  if (!currentUser) return null;

  // Filter orders for this customer
  const customerOrders = orders.filter(
    o => o.customerId === currentUser.id || o.customerCode === currentUser.customerCode
  );

  const handleCopyUtr = (utr: string) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtr(utr);
    setTimeout(() => setCopiedUtr(null), 2000);
  };

  const handleSendSmsNotice = (orderId: string, phone: string, trackingNumber?: string) => {
    setSentSmsOrderId(orderId);
    setTimeout(() => setSentSmsOrderId(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner & Greetings */}
      <div className="geometric-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-extrabold text-2xl shadow-sm border border-blue-500/30">
            {currentUser.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{currentUser.fullName}</h2>
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                Verified Citizen
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Customer ID:{' '}
              <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {currentUser.customerCode}
              </span>
              {' '}• Member since {new Date(currentUser.createdAt).toLocaleDateString('en-GB')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('services')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Order New PVC Card</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Official Digital Customer ID Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="geometric-card-dark text-white p-6 relative overflow-hidden geometric-grid-dark">
            {/* Holographic background badge */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <span className="text-xs font-extrabold tracking-wider uppercase text-blue-300">
                  EzySeva Digital Identity
                </span>
              </div>
              <span className="text-[10px] font-mono bg-white/10 text-slate-200 px-2 py-0.5 rounded font-bold border border-white/10">
                CSC PASS
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Customer ID Number</span>
                <span className="text-2xl font-black font-mono tracking-wider text-amber-300">
                  {currentUser.customerCode}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Citizen Name</span>
                <span className="text-base font-bold text-white block">{currentUser.fullName}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/10">
                <div>
                  <span className="text-[10px] text-slate-400 block">State</span>
                  <span className="font-semibold text-slate-200 truncate block">{currentUser.state}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">District</span>
                  <span className="font-semibold text-slate-200 truncate block">{currentUser.district}</span>
                </div>
              </div>

              <div className="text-xs">
                <span className="text-[10px] text-slate-400 block">Registered Address</span>
                <span className="text-slate-300 text-[11px] leading-relaxed block">
                  {currentUser.address}, {currentUser.pinCode}
                </span>
              </div>
            </div>

            {/* Barcode Graphic */}
            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-slate-400 text-[10px]">
              <div className="font-mono tracking-widest text-[11px] text-slate-300 flex items-center gap-1">
                <Barcode className="w-6 h-6 text-slate-400" />
                <span>*{currentUser.customerCode}*</span>
              </div>
              <span className="text-emerald-400 font-semibold">Active & Valid</span>
            </div>
          </div>

          {/* Quick Contact & Details card */}
          <div className="geometric-card p-5 space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 text-sm">Customer Profile Details</h4>
            
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{currentUser.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="truncate">{currentUser.email}</span>
            </div>
            <div className="flex items-start gap-2 text-slate-600">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>{currentUser.address}, {currentUser.district}, {currentUser.state} - {currentUser.pinCode}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Orders & Invoices List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="geometric-card p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900">My Orders & Invoices</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track real-time status of your PVC cards, copy UTR numbers, and download official tax receipts.
                </p>
              </div>
              <span className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1 rounded-full border border-slate-200">
                {customerOrders.length} {customerOrders.length === 1 ? 'Order' : 'Orders'}
              </span>
            </div>

            {customerOrders.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-700 text-base">No orders placed yet</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Browse our high-quality waterproof PVC smart cards and order with fast Speed Post delivery!
                </p>
                <button
                  onClick={() => setCurrentView('services')}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm"
                >
                  Order PVC Card Now
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {customerOrders.map((order) => {
                  const isDelivered = order.status === 'Delivered';
                  const isDispatched = order.status === 'Dispatched';
                  const isPrinting = order.status === 'Printing';
                  const isVerified = order.payment.status === 'Verified';

                  return (
                    <div
                      key={order.id}
                      className="geometric-card p-5 space-y-4 hover:border-blue-300"
                    >
                      {/* Order Title & Status */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-base text-slate-900">{order.serviceTitle}</h4>
                            <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                              isDelivered ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              isDispatched ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              isPrinting ? 'bg-purple-50 text-purple-700 border-purple-200' :
                              'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              ● {order.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Order ID: <strong className="font-mono text-slate-700">{order.id}</strong> • Placed on {new Date(order.createdAt).toLocaleDateString('en-GB')}
                          </p>
                        </div>

                        {/* Invoice, WhatsApp, SpeedPost Receipt & Track Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => openSpeedPostReceipt(order)}
                            title="Official India Post Speed Post Dispatch & Delivery Receipt"
                            className="bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
                          >
                            <PackageCheck className="w-3.5 h-3.5 text-amber-700" />
                            <span>Post Receipt</span>
                          </button>

                          <a
                            href={getWhatsAppChatUrl(
                              order.shippingAddress.phone || siteSettings.contactWhatsApp, 
                              buildOrderConfirmationMessage(order, siteSettings.siteName)
                            )}
                            target="_blank"
                            rel="noreferrer"
                            title="Share on WhatsApp or ask support"
                            className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="hidden sm:inline">WhatsApp</span>
                          </a>

                          <button
                            onClick={() => handleSendSmsNotice(order.id, order.shippingAddress.phone, order.tracking?.trackingNumber)}
                            title="Resend SMS Delivery Notification"
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1.5 rounded-xl shadow-sm flex items-center gap-1 transition-colors"
                          >
                            <Send className="w-3.5 h-3.5 text-slate-500" />
                            <span className="hidden sm:inline">SMS</span>
                          </button>

                          <button
                            onClick={() => openInvoiceForOrder(order)}
                            className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                            <span>Invoice</span>
                          </button>

                          <button
                            onClick={() => openTrackingForOrder(order.tracking?.trackingNumber || order.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Track</span>
                          </button>
                        </div>
                      </div>

                      {/* Toast when SMS is triggered */}
                      {sentSmsOrderId === order.id && (
                        <div className="bg-emerald-50 border border-emerald-300 p-2.5 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
                          <span>
                            📲 <strong>SMS Sent to {order.shippingAddress.phone}:</strong> "Order #{order.id} for {order.serviceTitle} is in progress. Speed Post Tracking: {order.tracking?.trackingNumber || 'Pending'}."
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600">DELIVERED</span>
                        </div>
                      )}

                      {/* Detail Metrics Bar */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold block">QUANTITY</span>
                          <span className="font-bold text-slate-900">{order.quantity} {order.quantity === 1 ? 'Card' : 'Cards'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold block">TOTAL AMOUNT</span>
                          <span className="font-mono font-black text-emerald-700">₹{order.totalAmount}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold block">UPI UTR NO.</span>
                          <div className="flex items-center gap-1">
                            <span className="font-mono font-bold text-slate-800 truncate">
                              {order.payment.utrNumber}
                            </span>
                            <button
                              onClick={() => handleCopyUtr(order.payment.utrNumber)}
                              className="text-slate-400 hover:text-slate-700 p-0.5"
                              title="Copy UTR"
                            >
                              {copiedUtr === order.payment.utrNumber ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold block">TRACKING NUMBER</span>
                          <span className="font-mono font-bold text-amber-700 truncate block">
                            {order.tracking?.trackingNumber || 'Pending Dispatch'}
                          </span>
                        </div>
                      </div>

                      {/* Speed Post Tracking snapshot */}
                      {order.tracking && (
                        <div className="text-xs text-slate-600 flex items-center justify-between pt-1">
                          <div className="flex items-center gap-2 truncate">
                            <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                            <span className="truncate">
                              Partner: <strong className="text-slate-900">{order.tracking.courierPartner}</strong>
                              {order.tracking.currentLocation && ` • Current: ${order.tracking.currentLocation}`}
                            </span>
                          </div>
                          <span className="text-blue-700 font-semibold shrink-0">
                            Est. Delivery: {order.tracking.estimatedDelivery || 'In 3-4 days'}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
