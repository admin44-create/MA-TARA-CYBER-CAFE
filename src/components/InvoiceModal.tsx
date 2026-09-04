import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  MapPin, 
  Phone, 
  Mail, 
  QrCode, 
  Barcode 
} from 'lucide-react';

export const InvoiceModal: React.FC = () => {
  const { 
    invoiceModalOpen, 
    setInvoiceModalOpen, 
    selectedOrderForInvoice, 
    siteSettings 
  } = useApp();

  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!invoiceModalOpen || !selectedOrderForInvoice) return null;

  const order = selectedOrderForInvoice;
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHtml = () => {
    if (!invoiceRef.current) return;
    const invoiceContent = invoiceRef.current.innerHTML;
    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${order.invoiceNumber}</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <style>
          @media print { body { -webkit-print-color-adjust: exact; } }
          body { font-family: sans-serif; background: #ffffff; padding: 20px; }
        </style>
      </head>
      <body>
        <div style="max-width: 800px; margin: 0 auto;">
          ${invoiceContent}
        </div>
      </body>
      </html>
    `;
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${order.invoiceNumber}_${order.customerCode}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="geometric-card shadow-2xl max-w-3xl w-full overflow-hidden p-0 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Control Bar (Hidden on print) */}
        <div className="print:hidden bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-sm">Official Tax Invoice & Receipt</span>
            <span className="text-xs font-mono text-blue-300">({order.invoiceNumber})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadHtml}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>

            <button
              type="button"
              onClick={() => setInvoiceModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* INVOICE PAPER CONTENT (PRINT READY) */}
        <div className="p-8 max-h-[80vh] overflow-y-auto print:max-h-none print:p-0" ref={invoiceRef}>
          <div className="border-2 border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 bg-white shadow-sm">
            
            {/* Header with Organization Details & Status Badge */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b-2 border-slate-200">
              <div className="flex items-start gap-3">
                {siteSettings.logoUrl && (
                  <img
                    src={siteSettings.logoUrl}
                    alt={siteSettings.siteName}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <div>
                  <h2 className="text-xl font-black text-slate-900 leading-tight">
                    {siteSettings.siteName}
                  </h2>
                  <p className="text-xs text-slate-600 font-medium">{siteSettings.tagline}</p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-sm">
                    {siteSettings.officeAddress}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1">
                    <span>Reg. Kendra: <strong>CSC-WB-9214</strong></span>
                    <span>•</span>
                    <span>Speed Post Dispatch Authorization: <strong>IND-PST-711101</strong></span>
                  </div>
                </div>
              </div>

              {/* Invoice Number & Paid Stamp */}
              <div className="text-right shrink-0 space-y-1">
                <span className="inline-block bg-blue-50 text-blue-800 text-xs font-black uppercase px-3 py-1 rounded-full border border-blue-200">
                  TAX INVOICE & RECEIPT
                </span>
                <div className="text-xs text-slate-600 mt-1">
                  Invoice No: <strong className="font-mono text-slate-900">{order.invoiceNumber}</strong>
                </div>
                <div className="text-xs text-slate-600">
                  Date: <strong className="text-slate-900">{orderDate}</strong>
                </div>
                <div className="text-xs text-slate-600">
                  Order ID: <strong className="font-mono text-slate-900">{order.id}</strong>
                </div>
              </div>
            </div>

            {/* Customer Information & Billing details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  BILLED TO (CUSTOMER DETAILS)
                </span>
                <p className="font-bold text-slate-900 text-sm">{order.shippingAddress.recipientName}</p>
                <div className="mt-1 space-y-0.5 text-slate-600">
                  <p>Customer ID: <strong className="font-mono text-blue-700 font-bold">{order.customerCode}</strong></p>
                  <p>Mobile: {order.shippingAddress.phone}</p>
                  {order.customerEmail && <p>Email: {order.customerEmail}</p>}
                  {order.documentNumber && (
                    <p>Doc/ID Reference: <strong className="font-mono text-slate-800">{order.documentNumber}</strong></p>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  DELIVERY DESTINATION
                </span>
                <p className="font-semibold text-slate-800 leading-relaxed">
                  {order.shippingAddress.fullAddress}
                </p>
                <p className="font-bold text-slate-900 mt-1">
                  {order.shippingAddress.district}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}
                </p>
                <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <span className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded font-mono font-bold">
                    SPEED POST
                  </span>
                  <span>Consignment: <strong className="font-mono text-slate-900">{order.tracking?.trackingNumber || 'EZTRACK-PENDING'}</strong></span>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-300 text-[11px] font-bold text-slate-600 uppercase bg-slate-100/70">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Service / Product Description</th>
                    <th className="py-2.5 px-3">SAC / HSN</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Rate</th>
                    <th className="py-2.5 px-3 text-right">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700 font-medium">
                  <tr>
                    <td className="py-3 px-3 text-slate-400">01</td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {order.serviceTitle}
                      <span className="block text-[10px] text-slate-500 font-normal mt-0.5">
                        Waterproof High-Gloss 800 Micron PVC Smart Card Print with UV Coating
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500">998313</td>
                    <td className="py-3 px-3 text-center font-bold">{order.quantity}</td>
                    <td className="py-3 px-3 text-right font-mono">₹{order.servicePrice.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      ₹{(order.servicePrice * order.quantity).toFixed(2)}
                    </td>
                  </tr>

                  {order.deliveryCharge > 0 && (
                    <tr>
                      <td className="py-2.5 px-3 text-slate-400">02</td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">
                        Speed Post Tracked Doorstep Delivery (India Post)
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">996812</td>
                      <td className="py-2.5 px-3 text-center">1</td>
                      <td className="py-2.5 px-3 text-right font-mono">₹{order.deliveryCharge.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        ₹{order.deliveryCharge.toFixed(2)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Calculations & Payment Ledger Record */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              {/* Payment Proof Box */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-blue-800 font-bold mb-1">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>UPI Payment Details Verified</span>
                </div>
                <div className="text-[11px] text-slate-700">
                  Payment Mode: <strong className="font-semibold">UPI (Unified Payments Interface)</strong>
                </div>
                <div className="text-[11px] text-slate-700">
                  UPI Ref No / UTR Number:{' '}
                  <strong className="font-mono bg-blue-100 text-blue-950 px-1.5 py-0.5 rounded font-bold">
                    {order.payment.utrNumber}
                  </strong>
                </div>
                <div className="text-[11px] text-slate-700">
                  Merchant: <strong>{siteSettings.upiMerchantName} ({siteSettings.upiId})</strong>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  Timestamp: {new Date(order.payment.paidAt).toLocaleString('en-GB')}
                </div>
              </div>

              {/* Total Calculation */}
              <div className="space-y-1 text-xs text-right sm:pl-8">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono font-medium">₹{(order.servicePrice * order.quantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (18% Integrated Tax Included):</span>
                  <span className="font-mono font-medium">₹{((order.totalAmount * 18) / 118).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Speed Post Delivery:</span>
                  <span className="font-mono font-medium">
                    {order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t-2 border-slate-300">
                  <span>Total Paid (INR):</span>
                  <span className="font-mono text-blue-700 text-lg">₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>

            </div>

            {/* Footer with Digital Seal and Disclaimer */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <div className="text-center sm:text-left space-y-1">
                <p className="font-bold text-slate-700">Declaration & Terms:</p>
                <p className="text-[10px] max-w-sm">
                  This is a computer-generated tax invoice and proof of online service delivery under CSC Seva guidelines.
                  For queries, reach out at {siteSettings.contactEmail} or WhatsApp {siteSettings.contactWhatsApp}.
                </p>
              </div>

              <div className="text-center shrink-0 border border-slate-300 rounded-xl p-2.5 bg-slate-50/70">
                <div className="w-16 h-16 border-2 border-dashed border-blue-600 rounded-full flex items-center justify-center mx-auto text-blue-700 font-bold text-[9px] uppercase tracking-tighter leading-tight text-center">
                  EzySeva<br />CSC Verified<br />SEAL
                </div>
                <span className="text-[10px] font-bold text-slate-700 block mt-1">Authorized Digital Signatory</span>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Bottom Controls */}
        <div className="print:hidden p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Customer ID: <strong className="font-mono text-slate-800">{order.customerCode}</strong>
          </span>
          <button
            type="button"
            onClick={() => setInvoiceModalOpen(false)}
            className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800"
          >
            Close Invoice
          </button>
        </div>

      </div>
    </div>
  );
};
