import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_INDIAN_STATES, getDistrictsForState } from '../data/indiaLocations';
import { 
  X, 
  CreditCard, 
  QrCode, 
  Copy, 
  Check, 
  Upload, 
  Truck, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle,
  HelpCircle,
  MessageCircle,
  PackageCheck,
  Send
} from 'lucide-react';
import { getWhatsAppChatUrl, buildOrderConfirmationMessage } from '../utils/whatsapp';

export const OrderModal: React.FC = () => {
  const { 
    orderModalOpen, 
    setOrderModalOpen, 
    selectedServiceForOrder, 
    currentUser, 
    siteSettings, 
    placeOrder, 
    openInvoiceForOrder, 
    openSpeedPostReceipt,
    openTrackingForOrder 
  } = useApp();

  const [step, setStep] = useState<'details' | 'address' | 'payment' | 'success'>('details');

  // Order state
  const [quantity, setQuantity] = useState<number>(1);
  const [documentNumber, setDocumentNumber] = useState<string>('');
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFilePreview, setUploadedFilePreview] = useState<string>('');

  // Address state (prefilled from currentUser)
  const [recipientName, setRecipientName] = useState<string>('');
  const [recipientPhone, setRecipientPhone] = useState<string>('');
  const [state, setState] = useState<string>('West Bengal');
  const [district, setDistrict] = useState<string>('North 24 Parganas');
  const [pinCode, setPinCode] = useState<string>('');
  const [fullAddress, setFullAddress] = useState<string>('');

  // Payment state
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [paymentSlipName, setPaymentSlipName] = useState<string>('');
  const [paymentSlipUrl, setPaymentSlipUrl] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Placed order result
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  // Prefill user data when modal opens
  useEffect(() => {
    if (currentUser) {
      setRecipientName(currentUser.fullName);
      setRecipientPhone(currentUser.phone);
      setState(currentUser.state || 'West Bengal');
      setDistrict(currentUser.district || 'North 24 Parganas');
      setPinCode(currentUser.pinCode || '');
      setFullAddress(currentUser.address || '');
    }
  }, [currentUser, orderModalOpen]);

  if (!orderModalOpen || !selectedServiceForOrder) return null;

  const districts = getDistrictsForState(state);

  const handleStateChange = (newState: string) => {
    setState(newState);
    const newDistricts = getDistrictsForState(newState);
    setDistrict(newDistricts[0] || '');
  };

  const deliveryFee = quantity >= 3 ? 0 : siteSettings.deliveryFeePerOrder;
  const subtotal = selectedServiceForOrder.price * quantity;
  const totalAmount = subtotal + deliveryFee;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      // Create object URL for preview
      const url = URL.createObjectURL(file);
      setUploadedFilePreview(url);
    }
  };

  const handleSlipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentSlipName(file.name);
      const url = URL.createObjectURL(file);
      setPaymentSlipUrl(url);
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(siteSettings.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleFinalPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError('');

    const cleanUtr = utrNumber.trim();
    if (!cleanUtr || cleanUtr.length < 8) {
      setPaymentError('Please enter a valid 12-digit UTR / UPI Transaction Reference Number from your GPay, PhonePe, or Paytm app.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = placeOrder({
        serviceId: selectedServiceForOrder.id,
        quantity,
        shippingAddress: {
          recipientName,
          phone: recipientPhone,
          state,
          district,
          pinCode,
          fullAddress
        },
        documentNumber,
        uploadedDocumentName: uploadedFileName || `${selectedServiceForOrder.title.replace(/\s+/g, '_')}_Document.pdf`,
        uploadedDocumentUrl: uploadedFilePreview,
        orderNotes,
        utrNumber: cleanUtr,
        slipUrl: paymentSlipUrl
      });

      setIsSubmitting(false);

      if (result.success && result.order) {
        setCreatedOrder(result.order);
        setStep('success');
      } else {
        setPaymentError(result.message || 'Failed to place order.');
      }
    }, 800);
  };

  const handleClose = () => {
    setOrderModalOpen(false);
    setStep('details');
    setQuantity(1);
    setDocumentNumber('');
    setUtrNumber('');
    setCreatedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="geometric-card shadow-2xl max-w-2xl w-full overflow-hidden p-0 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-slate-950 text-white p-6 relative border-b border-slate-800">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
              Seva Order Portal
            </span>
            {currentUser && (
              <span className="text-xs text-blue-300 font-mono font-bold">
                Customer ID: {currentUser.customerCode}
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            {selectedServiceForOrder.title}
          </h3>

          {/* Stepper Indicator */}
          {step !== 'success' && (
            <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-800 text-xs font-semibold">
              <div className={`flex items-center gap-1.5 ${step === 'details' ? 'text-blue-400 font-bold' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'details' ? 'bg-blue-600 text-white' : 'bg-slate-800'}`}>1</span>
                <span>Document & Qty</span>
              </div>
              <div className="w-8 h-0.5 bg-slate-800" />
              <div className={`flex items-center gap-1.5 ${step === 'address' ? 'text-blue-400 font-bold' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'address' ? 'bg-blue-600 text-white' : 'bg-slate-800'}`}>2</span>
                <span>Speed Post Address</span>
              </div>
              <div className="w-8 h-0.5 bg-slate-800" />
              <div className={`flex items-center gap-1.5 ${step === 'payment' ? 'text-blue-400 font-bold' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'payment' ? 'bg-blue-600 text-white' : 'bg-slate-800'}`}>3</span>
                <span>UPI Payment & UTR</span>
              </div>
            </div>
          )}
        </div>

        {/* STEP 1: DOCUMENT & QUANTITY */}
        {step === 'details' && (
          <div className="p-6 space-y-5">
            {/* Quantity Selector */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Select Number of Copies / PVC Cards</h4>
                <p className="text-xs text-slate-500">Order 3 or more for 100% Free Speed Post Delivery!</p>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 5, 10].map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setQuantity(qty)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                      quantity === qty 
                        ? 'bg-blue-600 text-white shadow-md scale-105' 
                        : 'bg-white text-slate-700 border border-slate-300 hover:border-blue-400'
                    }`}
                  >
                    {qty}
                  </button>
                ))}
              </div>
            </div>

            {/* Document Number Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Enter Identification / Document No. (Aadhaar / Voter / PAN / Ration No)
              </label>
              <input
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder="e.g. 12-digit Aadhaar / EPIC Voter No / ABCDE1234F"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            {/* File / PDF Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Upload e-Card PDF or Document Photo (Front & Back)
              </label>
              <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-4 text-center bg-slate-50/50 hover:bg-blue-50/30 transition-all cursor-pointer relative">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                {uploadedFileName ? (
                  <div>
                    <span className="text-xs font-bold text-blue-700 block">✓ Selected: {uploadedFileName}</span>
                    <span className="text-[11px] text-slate-500">Click to replace file</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-bold text-slate-800">Click to browse or drag and drop file here</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Supports PDF, JPG, PNG (Max 15MB)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Optional Instructions */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Special Instructions (Optional)
              </label>
              <input
                type="text"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="e.g. Please print with QR code clearly visible"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Price Preview */}
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between text-xs">
              <span className="text-blue-900 font-medium">
                {quantity} × ₹{selectedServiceForOrder.price} + Delivery (₹{deliveryFee})
              </span>
              <span className="font-extrabold text-sm text-blue-900">
                Total: ₹{totalAmount}
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setStep('address')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-6 py-2.5 rounded-xl shadow flex items-center gap-2"
              >
                <span>Continue to Shipping Address</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SHIPPING ADDRESS */}
        {step === 'address' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-xl text-xs">
              <Truck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Your smart PVC card will be securely packed in a tamper-proof envelope and delivered by India Post Speed Post.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Contact Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            {/* State and District Dropdown Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Delivery State / UT *
                </label>
                <select
                  value={state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  {ALL_INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Delivery District *
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  {districts.map((dst) => (
                    <option key={dst} value={dst}>{dst}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  House/Flat No, Street, Landmark *
                </label>
                <input
                  type="text"
                  required
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={!recipientName.trim() || !recipientPhone.trim() || !fullAddress.trim() || !pinCode.trim()}
                onClick={() => setStep('payment')}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-extrabold px-6 py-2.5 rounded-xl shadow flex items-center gap-2"
              >
                <span>Proceed to UPI Payment Gateway</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: UPI PAYMENT GATEWAY ("payment getaway de") */}
        {step === 'payment' && (
          <form onSubmit={handleFinalPaymentSubmit} className="p-6 space-y-4">
            {paymentError && (
              <div className="p-3 bg-red-50 text-red-900 border border-red-200 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{paymentError}</span>
              </div>
            )}

            {/* Gateway Container */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                
                {/* QR Code */}
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 text-center shrink-0">
                  <img
                    src={siteSettings.upiQrImageUrl}
                    alt="Scan UPI QR Code"
                    className="w-36 h-36 rounded-lg object-contain mx-auto"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${siteSettings.upiId}&pn=${encodeURIComponent(siteSettings.upiMerchantName)}&am=${totalAmount}&cu=INR`;
                    }}
                  />
                  <span className="text-[10px] font-bold text-slate-500 mt-1 block">Scan with any UPI App</span>
                  <div className="flex items-center justify-center gap-1 text-[9px] font-bold text-slate-600 mt-0.5">
                    <span>GPay</span> • <span>PhonePe</span> • <span>Paytm</span>
                  </div>
                </div>

                {/* Amount & UPI Details */}
                <div className="space-y-3 flex-1 w-full">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Payable Amount</span>
                    <div className="text-3xl font-black text-slate-900">
                      ₹{totalAmount}
                    </div>
                    <span className="text-xs text-blue-700 font-semibold">Includes Taxes & Speed Post Delivery</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                    <span className="text-[10px] font-bold text-slate-500 block">Merchant Name</span>
                    <span className="font-bold text-slate-900">{siteSettings.upiMerchantName}</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block">UPI ID / VPA</span>
                      <span className="font-mono font-bold text-slate-900">{siteSettings.upiId}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Customer UTR Number Entry */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Enter 12-Digit UPI Reference No / UTR Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="e.g. 428901847192 (found on UPI payment success screen)"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono font-bold"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Open your UPI app transaction history and copy the 12-digit UPI Ref ID / UTR number.
                </p>
              </div>

              {/* Upload Payment Screenshot */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Upload Payment Screenshot / Slip (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose Screenshot</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSlipUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-slate-500 truncate">
                    {paymentSlipName || 'No screenshot selected'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep('address')}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-extrabold px-6 py-3 rounded-xl shadow flex items-center gap-2 transition-all transform active:scale-95"
              >
                {isSubmitting ? (
                  <span>Generating Invoice & Confirming...</span>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Submit Payment & Generate Tax Invoice</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: SUCCESS & INSTANT INVOICE GENERATION */}
        {step === 'success' && createdOrder && (
          <div className="p-6 text-center space-y-5">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">Order Placed Successfully!</h3>
              <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                Payment received with UTR: <strong className="font-mono text-slate-900">{createdOrder.payment.utrNumber}</strong>. Your official Tax Invoice has been generated and is ready for download.
              </p>
            </div>

            {/* Highlights Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">ORDER ID</span>
                <span className="font-mono font-extrabold text-slate-900">{createdOrder.id}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">INVOICE NO.</span>
                <span className="font-mono font-extrabold text-blue-700">{createdOrder.invoiceNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">CUSTOMER ID</span>
                <span className="font-mono font-bold text-slate-900">{createdOrder.customerCode}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">SERVICE</span>
                <span className="font-bold text-slate-900 truncate">{createdOrder.serviceTitle}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">TRACKING NO.</span>
                <span className="font-mono font-bold text-amber-700">{createdOrder.tracking?.trackingNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">COURIER</span>
                <span className="font-bold text-slate-900">India Post Speed Post</span>
              </div>
            </div>

            {/* Automated SMS & WhatsApp Notification Status */}
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-left space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  SMS & WhatsApp Confirmation Dispatched
                </span>
                <span className="bg-emerald-200/80 text-emerald-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                  AUTO-SENT
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed font-mono bg-white/70 p-2.5 rounded-xl border border-emerald-200">
                📩 <strong>SMS Sent to {createdOrder.shippingAddress.phone}:</strong> "Dear {createdOrder.shippingAddress.fullName}, your {createdOrder.serviceTitle} order #{createdOrder.id} has been confirmed. Speed Post Tracking: {createdOrder.tracking?.trackingNumber}. Address: {createdOrder.shippingAddress.district}, PIN: {createdOrder.shippingAddress.pinCode}. EzySeva."
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  openSpeedPostReceipt(createdOrder);
                }}
                className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow flex items-center justify-center gap-2 transition-all"
              >
                <PackageCheck className="w-4 h-4 text-amber-200" />
                <span>Speed Post Dispatch Receipt</span>
              </button>

              <a
                href={getWhatsAppChatUrl(
                  siteSettings.contactWhatsApp, 
                  buildOrderConfirmationMessage(createdOrder, siteSettings.siteName)
                )}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow flex items-center justify-center gap-2 transition-all transform active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Share on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  handleClose();
                  openInvoiceForOrder(createdOrder);
                }}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Download Invoice</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleClose();
                  openTrackingForOrder(createdOrder.tracking?.trackingNumber || createdOrder.id);
                }}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" />
                <span>Track Order Live</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
