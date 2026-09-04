import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Search, 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  Copy, 
  Check, 
  AlertCircle,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { getWhatsAppChatUrl, buildTrackingInquiryMessage } from '../utils/whatsapp';

export const OrderTrackingModal: React.FC = () => {
  const { 
    trackingModalOpen, 
    setTrackingModalOpen, 
    activeTrackingNumber, 
    orders, 
    siteSettings,
    currentUser,
    openInvoiceForOrder 
  } = useApp();

  const [searchInput, setSearchInput] = useState(activeTrackingNumber || '');
  const [copied, setCopied] = useState(false);

  if (!trackingModalOpen) return null;

  // Search logic: matches trackingNumber, order id, customer code, or phone
  const cleanQuery = (searchInput || activeTrackingNumber).trim().toLowerCase();
  
  const matchedOrder = orders.find(order => {
    if (!cleanQuery) return false;
    const trackNum = order.tracking?.trackingNumber?.toLowerCase() || '';
    const ordId = order.id.toLowerCase();
    const custCode = order.customerCode?.toLowerCase() || '';
    const phone = order.customerPhone?.toLowerCase() || '';
    return trackNum.includes(cleanQuery) || ordId === cleanQuery || custCode === cleanQuery || phone === cleanQuery;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="geometric-card shadow-2xl max-w-2xl w-full overflow-hidden p-0 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-950 text-white p-6 relative border-b border-slate-800">
          <button
            onClick={() => setTrackingModalOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
              Live Courier Tracking
            </span>
            <span className="text-xs text-slate-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> India Post Speed Post Network
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black">
            Track PVC Smart Card & Consignment
          </h3>

          {/* Search bar inside header */}
          <div className="mt-4 relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Tracking No (e.g. EZTRACK-782194), Order ID, or Customer ID"
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
        </div>

        {/* Tracking Details */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {!matchedOrder ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">No Consignment or Order Found</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Please check the tracking number or Order ID. If you just placed an order, enter your Customer ID or Order ID.
              </p>

              {/* Demo track numbers */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 block mb-2">Try available sample tracking numbers:</span>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => setSearchInput('EZTRACK-782194')}
                    className="text-xs font-mono bg-blue-50 hover:bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg border border-blue-200"
                  >
                    EZTRACK-782194 (Rahul Sharma - Dispatched)
                  </button>
                  <button
                    onClick={() => setSearchInput('EZTRACK-649102')}
                    className="text-xs font-mono bg-amber-50 hover:bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg border border-amber-200"
                  >
                    EZTRACK-649102 (Priya - Printing)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Order & Consignment Summary Card */}
              <div className="stat-box p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Consignment Tracking Number</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-lg font-black text-slate-900 font-mono">
                        {matchedOrder.tracking?.trackingNumber || 'Tracking Pending'}
                      </span>
                      {matchedOrder.tracking?.trackingNumber && (
                        <button
                          onClick={() => handleCopy(matchedOrder.tracking!.trackingNumber)}
                          className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800"
                          title="Copy tracking number"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-xs font-extrabold rounded-full ${
                      matchedOrder.status === 'Delivered' 
                        ? 'bg-emerald-100 text-emerald-800'
                        : matchedOrder.status === 'Dispatched'
                        ? 'bg-blue-100 text-blue-800'
                        : matchedOrder.status === 'Printing'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      ● {matchedOrder.status}
                    </span>

                    <button
                      onClick={() => openInvoiceForOrder(matchedOrder)}
                      className="text-xs font-bold text-blue-700 hover:text-blue-900 bg-white border border-blue-300 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Invoice</span>
                    </button>
                  </div>
                </div>

                {/* Meta details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">SERVICE</span>
                    <span className="font-bold text-slate-900 truncate block">{matchedOrder.serviceTitle}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">RECIPIENT & DISTRICT</span>
                    <span className="font-semibold text-slate-800 block">
                      {matchedOrder.shippingAddress.recipientName} ({matchedOrder.shippingAddress.district}, {matchedOrder.shippingAddress.state})
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">COURIER PARTNER</span>
                    <span className="font-bold text-slate-900 block">{matchedOrder.tracking?.courierPartner || 'India Post Speed Post'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">ESTIMATED DELIVERY</span>
                    <span className="font-bold text-blue-700 block">
                      {matchedOrder.tracking?.estimatedDelivery || '3-4 Working Days'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Timeline Stepper */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Tracking Milestones & History</span>
                </h4>

                <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                  {matchedOrder.tracking?.history?.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-4">
                      {/* Milestone Dot */}
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                        step.completed 
                          ? 'bg-blue-600 text-white shadow' 
                          : 'bg-slate-100 border-2 border-slate-300 text-slate-400'
                      }`}>
                        {step.completed ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-3.5 h-3.5" />}
                      </div>

                      {/* Content */}
                      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex-1 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h5 className={`text-xs font-bold ${step.completed ? 'text-slate-900' : 'text-slate-500'}`}>
                            {step.status}
                          </h5>
                          <span className="text-[11px] font-mono text-slate-500">
                            {step.date}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          {step.note}
                        </p>
                        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-400">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{step.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery destination card */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 font-bold">Delivery Address: </strong>
                  {matchedOrder.shippingAddress.fullAddress}, {matchedOrder.shippingAddress.district}, {matchedOrder.shippingAddress.state} - {matchedOrder.shippingAddress.pinCode}
                  <span className="block text-[11px] text-slate-500 font-mono mt-0.5">Phone: {matchedOrder.shippingAddress.phone}</span>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500">
              Official Speed Post Consignment Tracking
            </span>
            <a
              href={getWhatsAppChatUrl(
                siteSettings.contactWhatsApp, 
                buildTrackingInquiryMessage(cleanQuery || 'consignment', siteSettings.siteName, currentUser)
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ask Help on WhatsApp</span>
            </a>
          </div>

          <button
            onClick={() => setTrackingModalOpen(false)}
            className="px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
