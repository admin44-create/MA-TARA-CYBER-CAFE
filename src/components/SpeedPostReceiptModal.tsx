import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { 
  X, 
  Printer, 
  Download, 
  Share2, 
  CheckCircle2, 
  Truck, 
  Package, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Phone,
  Barcode,
  Award
} from 'lucide-react';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';

interface SpeedPostReceiptModalProps {
  order?: Order | null;
  isOpen?: boolean;
  onClose?: () => void;
}

export const SpeedPostReceiptModal: React.FC<SpeedPostReceiptModalProps> = (props) => {
  const { 
    siteSettings, 
    speedPostReceiptModalOpen, 
    setSpeedPostReceiptModalOpen, 
    selectedOrderForSpeedPost 
  } = useApp();

  const isOpen = props.isOpen !== undefined ? props.isOpen : speedPostReceiptModalOpen;
  const order = props.order !== undefined ? props.order : selectedOrderForSpeedPost;
  const onClose = props.onClose || (() => setSpeedPostReceiptModalOpen(false));

  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !order) return null;

  const trackingNumber = order.tracking?.trackingNumber || `EW${Math.floor(100000000 + Math.random() * 900000000)}IN`;
  const bookingDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const bookingTime = new Date(order.createdAt).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const isDelivered = order.status === 'Delivered';
  const isDispatched = order.status === 'Dispatched' || order.status === 'Out for Delivery' || order.status === 'Delivered';

  const downloadReceiptPdf = () => {
    try {
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      // Header
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 25, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('INDIA POST - SPEED POST DISPATCH & DELIVERY RECEIPT', 105, 12, { align: 'center' });
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Department of Posts, Govt. of India • Speed Post Parcel & PVC Smart Card Acknowledgment', 105, 19, { align: 'center' });

      // Consignment box
      doc.setTextColor(0, 0, 0);
      doc.setDrawColor(203, 213, 225);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(15, 32, 180, 24, 2, 2, 'FD');

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('CONSIGNMENT NUMBER (স্পিড পোস্ট ট্র্যাকিং নম্বর):', 20, 39);
      doc.setFontSize(14);
      doc.setTextColor(30, 58, 138); // blue-900
      doc.text(trackingNumber, 20, 48);

      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text(`Booking Date: ${bookingDate} ${bookingTime}`, 130, 40);
      doc.text(`Booking Office: Howrah H.O. (711101)`, 130, 46);
      doc.text(`Weight: 45 gms • Tariff: Rs. 30.00 (Paid)`, 130, 52);

      // Status Badge
      doc.setFillColor(isDelivered ? 16 : isDispatched ? 2 : 234, isDelivered ? 185 : isDispatched ? 132 : 179, isDelivered ? 129 : isDispatched ? 199 : 8);
      doc.rect(15, 62, 180, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      const statusTitle = isDelivered 
        ? 'STATUS: DELIVERED & RECEIVED BY ADDRESSEE (বিতরণ সম্পন্ন)' 
        : isDispatched 
        ? 'STATUS: DISPATCHED & IN SPEED POST TRANSIT (ট্রানজিটে রয়েছে)' 
        : 'STATUS: BOOKED & UNDER PVC THERMAL PRINTING';
      doc.text(statusTitle, 105, 68.5, { align: 'center' });

      // Addresses
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('SENDER (প্রেরক):', 20, 80);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(siteSettings.siteName, 20, 86);
      doc.text(siteSettings.officeAddress, 20, 91);
      doc.text(`Helpdesk: ${siteSettings.contactPhone}`, 20, 96);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('ADDRESSEE / RECIPIENT (প্রাপক):', 110, 80);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Name: ${order.shippingAddress.recipientName}`, 110, 86);
      doc.text(`Address: ${order.shippingAddress.fullAddress}`, 110, 91);
      doc.text(`${order.shippingAddress.district}, ${order.shippingAddress.state} - PIN: ${order.shippingAddress.pinCode}`, 110, 96);
      doc.text(`Mobile: ${order.shippingAddress.phone}`, 110, 101);

      // PVC Card Order Details Table
      doc.setDrawColor(203, 213, 225);
      doc.setFillColor(241, 245, 249);
      doc.rect(15, 110, 180, 8, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      doc.text('Article Description', 20, 115);
      doc.text('Qty', 110, 115);
      doc.text('Order ID', 135, 115);
      doc.text('Delivery Method', 165, 115);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.rect(15, 118, 180, 12, 'D');
      doc.text(order.serviceTitle, 20, 125);
      doc.text(`${order.quantity} Card`, 110, 125);
      doc.text(order.id, 135, 125);
      doc.text('Speed Post', 165, 125);

      // Delivery Acknowledgment / Sign Box
      doc.setDrawColor(148, 163, 184);
      doc.roundedRect(15, 140, 180, 45, 2, 2, 'D');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text('PROOF OF DELIVERY / RECEIPT ACKNOWLEDGMENT (বিতরণ প্রমাণপত্র)', 20, 147);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`Delivery Post Office: ${order.shippingAddress.district} Head Post Office - ${order.shippingAddress.pinCode}`, 20, 154);
      doc.text(`Article Type: Smart PVC Identification Card (Waterproof & Scratch-proof)`, 20, 160);
      doc.text(`Delivery Confirmation: ${isDelivered ? 'Received and Signed by Customer' : 'Pending Doorstep Delivery by Beat Postman'}`, 20, 166);
      doc.text(`Delivery Partner: India Post Department of Posts (National Speed Post Service)`, 20, 172);

      // Sign stamps
      doc.rect(140, 148, 48, 30, 'D');
      doc.setFontSize(8);
      doc.text('Post Office Date Seal & Stamp', 142, 153);
      doc.setTextColor(100, 116, 139);
      doc.text('[ VERIFIED BY ]', 148, 165);
      doc.text('Speed Post Cell', 148, 172);

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('This is an official system-generated dispatch and delivery confirmation slip from EzySeva Digital Kendra.', 105, 280, { align: 'center' });
      doc.text('For parcel tracking inquiries, visit India Post tracking portal or contact support.', 105, 285, { align: 'center' });

      doc.save(`SpeedPost_Receipt_${trackingNumber}.pdf`);
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch {}
    } catch (err) {
      console.error(err);
      alert('Could not download PDF. Please try the print option.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const shareViaWhatsApp = () => {
    const text = `*INDIA POST SPEED POST DELIVERY RECEIPT*%0A` +
      `📦 *Consignment No:* ${trackingNumber}%0A` +
      `📋 *Order ID:* ${order.id}%0A` +
      `💳 *Service:* ${order.serviceTitle}%0A` +
      `👤 *Recipient:* ${order.shippingAddress.recipientName}%0A` +
      `📍 *Address:* ${order.shippingAddress.fullAddress}, ${order.shippingAddress.district}, ${order.shippingAddress.pinCode}%0A` +
      `🚚 *Status:* ${order.status}%0A` +
      `✅ *EzySeva Speed Post Certified Delivery*`;
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-black text-white text-xs">
              IP
            </div>
            <div>
              <h3 className="font-bold text-sm">India Post Speed Post Dispatch & Delivery Receipt</h3>
              <p className="text-[11px] text-slate-400">বাইপোস্ট পিভিসি স্মার্ট কার্ড ডেলিভারি ও ডিসপ্যাচ রিসিট</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={downloadReceiptPdf}
              className="p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={shareViaWhatsApp}
              className="p-2 text-emerald-300 hover:text-white bg-emerald-900/40 hover:bg-emerald-800/60 rounded-lg transition-colors"
              title="Share via WhatsApp"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Speed Post Certificate */}
        <div ref={receiptRef} className="p-6 md:p-8 space-y-6 text-slate-800 bg-white">
          
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex flex-col items-center justify-center font-black shadow leading-none shrink-0">
                <span className="text-[11px] tracking-wider">SPEED</span>
                <span className="text-xs tracking-wider">POST</span>
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight text-slate-950 uppercase">
                  भारतीय डाक / DEPARTMENT OF POSTS, INDIA
                </h2>
                <p className="text-xs font-semibold text-slate-600">
                  National Speed Post Centre • Booking & Delivery Acknowledgment Slip
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
                <Truck className="w-3.5 h-3.5" />
                <span>Speed Post Article</span>
              </span>
            </div>
          </div>

          {/* Consignment & Barcode Ribbon */}
          <div className="bg-slate-50 border-2 border-slate-300 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Official Consignment Tracking Number (ট্র্যাকিং নম্বর)
              </span>
              <div className="text-2xl font-mono font-black text-blue-900 tracking-wider mt-0.5">
                {trackingNumber}
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-1 flex items-center gap-3">
                <span>Booking Date: <strong>{bookingDate} {bookingTime}</strong></span>
                <span>•</span>
                <span>Office: <strong>Howrah H.O. (711101)</strong></span>
              </div>
            </div>

            {/* Fake Visual Barcode */}
            <div className="flex flex-col items-center justify-center p-2 bg-white rounded border border-slate-200">
              <div className="flex gap-0.5 h-9 items-end">
                {[4, 2, 6, 1, 5, 2, 4, 7, 2, 5, 3, 6, 2, 4, 6, 1, 3, 5, 2, 6, 3, 4, 2, 5].map((w, i) => (
                  <div key={i} className={`bg-slate-900 ${i % 2 === 0 ? 'w-1' : 'w-0.5'} h-${w + 3}`} style={{ height: `${20 + (w * 2)}px` }} />
                ))}
              </div>
              <span className="text-[9px] font-mono tracking-widest text-slate-600 mt-1">{trackingNumber}</span>
            </div>
          </div>

          {/* Status Alert Banner */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs font-bold ${
            isDelivered
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : isDispatched
              ? 'bg-blue-50 border-blue-300 text-blue-950'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className={`w-5 h-5 ${isDelivered ? 'text-emerald-600' : 'text-blue-600'}`} />
              <div>
                <span className="font-extrabold uppercase">
                  Current Status: {order.status}
                </span>
                <p className="text-[11px] font-normal opacity-90">
                  {isDelivered 
                    ? 'Item has been successfully delivered and signed by recipient addressee.' 
                    : isDispatched
                    ? 'Dispatched from Central Hub. In transit for doorstep delivery.'
                    : 'Order verified and queued for Speed Post packaging.'}
                </p>
              </div>
            </div>

            <span className="text-[11px] font-mono bg-white/80 px-2.5 py-1 rounded-lg border border-current shrink-0">
              Tariff: ₹30.00 (PAID)
            </span>
          </div>

          {/* Sender & Recipient Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Sender Details (প্রেরক)
              </span>
              <strong className="text-slate-900 text-sm block">{siteSettings.siteName}</strong>
              <p className="text-slate-600 mt-0.5 leading-relaxed">{siteSettings.officeAddress}</p>
              <p className="text-slate-600 mt-1 font-mono">Contact: {siteSettings.contactPhone}</p>
            </div>

            <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
                Recipient / Addressee (প্রাপক)
              </span>
              <strong className="text-slate-900 text-sm block">{order.shippingAddress.recipientName}</strong>
              <p className="text-slate-700 mt-0.5 leading-relaxed">{order.shippingAddress.fullAddress}</p>
              <p className="text-slate-700 font-semibold mt-0.5">
                {order.shippingAddress.district}, {order.shippingAddress.state} - PIN: {order.shippingAddress.pinCode}
              </p>
              <p className="text-slate-600 mt-1 font-mono">Mobile: {order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* PVC Article Details */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-100 p-2.5 font-bold text-slate-700 flex justify-between border-b border-slate-200">
              <span>Enclosed Article / Item Description</span>
              <span>Order Details</span>
            </div>
            <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <strong className="text-slate-900 text-sm">{order.serviceTitle}</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  High-durability CR80 Smart Card in Waterproof Pouch • Net Wt: 45g
                </p>
              </div>
              <div className="text-right font-mono text-slate-700">
                <div>Order Ref: <strong>{order.id}</strong></div>
                <div>Invoice: <strong>{order.invoiceNumber}</strong></div>
              </div>
            </div>
          </div>

          {/* Official India Post Seal & Delivery Ack Section */}
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-900 uppercase block text-[11px]">
                Proof of Delivery (POD) & Carrier Seal
              </span>
              <p className="text-slate-600 text-[11px]">
                Delivering Post Office: <strong>{order.shippingAddress.district} Head Post Office ({order.shippingAddress.pinCode})</strong>
              </p>
              <p className="text-slate-600 text-[11px]">
                Delivery Channel: <strong>National Speed Post Network (Department of Posts)</strong>
              </p>
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px] mt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Government Certified Speed Post Despatch Guarantee</span>
              </div>
            </div>

            {/* Official Postal Stamp Box */}
            <div className="w-36 h-28 border-2 border-slate-400 rounded-lg flex flex-col items-center justify-center p-2 text-center bg-white shadow-inner shrink-0">
              <div className="w-16 h-16 rounded-full border-2 border-red-700/60 flex flex-col items-center justify-center text-red-800 text-[8px] font-black leading-tight rotate-[-6deg]">
                <span>SPEED POST</span>
                <span>HOWRAH H.O.</span>
                <span>{bookingDate.split(' ')[0]}</span>
              </div>
              <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase">Postal Seal & Stamp</span>
            </div>
          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={shareViaWhatsApp}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-4 py-2 rounded-xl transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Send Receipt via WhatsApp</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadReceiptPdf}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
