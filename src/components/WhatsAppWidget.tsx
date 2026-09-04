import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, X, Send, ShieldCheck, Clock, FileUp, Sparkles, ExternalLink } from 'lucide-react';
import { getWhatsAppChatUrl, formatWhatsAppNumber } from '../utils/whatsapp';

export const WhatsAppWidget: React.FC = () => {
  const { siteSettings, currentUser } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [customText, setCustomText] = useState('');

  const quickOptions = [
    {
      title: '📄 Send Documents for Verification',
      text: `Hello ${siteSettings.siteName}, I want to send my documents for verification and online application.${currentUser ? ` My Customer ID is ${currentUser.customerCode} (${currentUser.fullName}).` : ''}`
    },
    {
      title: '🪪 Smart PVC Card Direct Order',
      text: `Hello ${siteSettings.siteName}, I want to order a Smart PVC Card (Aadhaar / Voter / PAN / Ayushman). Please guide me with fee & Speed Post delivery.${currentUser ? ` Customer ID: ${currentUser.customerCode}` : ''}`
    },
    {
      title: '💳 UTR Payment Verification',
      text: `Hello ${siteSettings.siteName} Accounts Desk, I have made a UPI payment and would like to verify my UTR.${currentUser ? ` Customer: ${currentUser.fullName} (${currentUser.customerCode})` : ''}`
    },
    {
      title: '🚚 Track Parcel / Speed Post Help',
      text: `Hello ${siteSettings.siteName}, I want an update regarding my parcel consignment & Speed Post tracking number.${currentUser ? ` Customer ID: ${currentUser.customerCode}` : ''}`
    }
  ];

  const handleStartChat = (messageText: string) => {
    const url = getWhatsAppChatUrl(siteSettings.contactWhatsApp, messageText);
    window.open(url, '_blank');
    setIsOpen(false);
    setCustomText('');
  };

  return (
    <>
      {/* Floating WhatsApp Action Button */}
      {!isOpen && (
        <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-1.5 group">
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-slate-700 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>WhatsApp Support</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-2xl shadow-xl hover:shadow-2xl border-2 border-white transition-all transform active:scale-95"
            aria-label="Open WhatsApp Support"
          >
            <div className="relative">
              <MessageCircle className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full ring-2 ring-emerald-600" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-black tracking-tight leading-tight flex items-center gap-1">
                <span>WhatsApp Desk</span>
                <span className="bg-emerald-500 text-[9px] px-1 rounded uppercase font-bold text-white">Online</span>
              </div>
              <div className="text-[10px] text-emerald-100 font-medium">Chat directly with Kendra staff</div>
            </div>
          </button>
        </div>
      )}

      {/* WhatsApp Modal/Card */}
      {isOpen && (
        <div className="fixed bottom-6 left-4 sm:left-6 z-50 w-[92vw] sm:w-88 md:w-96">
          <div className="geometric-card shadow-2xl overflow-hidden border-2 border-emerald-500/30 bg-white p-0">
            
            {/* Header */}
            <div className="bg-emerald-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-emerald-700 flex items-center justify-center font-bold shadow-sm">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    <span>{siteSettings.siteName}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-100">
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                    <span>Instant Support Desk • +{formatWhatsAppNumber(siteSettings.contactWhatsApp)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-emerald-200 hover:text-white bg-emerald-800/40 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-4 space-y-3 bg-slate-50">
              <div className="bg-white rounded-xl p-3 border border-slate-200 text-xs text-slate-700 shadow-sm leading-relaxed">
                👋 নমস্কার! আপনি কি কোনো আবেদন করতে চান বা ডকুমেন্ট পাঠাতে চান? নিচের অপশন নির্বাচন করুন অথবা সরাসরি মেসেজ লিখুন:
              </div>

              {/* Quick Option Buttons */}
              <div className="space-y-1.5">
                {quickOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleStartChat(opt.text)}
                    className="w-full text-left bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200/80 rounded-xl p-2.5 text-xs text-slate-800 font-semibold transition-all flex items-center justify-between group"
                  >
                    <span className="truncate pr-2">{opt.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="pt-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Or type your custom query:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && customText.trim()) {
                        handleStartChat(customText.trim());
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (customText.trim()) {
                        handleStartChat(customText.trim());
                      }
                    }}
                    disabled={!customText.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-2 rounded-xl transition-all shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-100 px-4 py-2 border-t border-slate-200 text-[10px] text-slate-500 text-center">
              Direct connection with authorized Kendra WhatsApp number
            </div>

          </div>
        </div>
      )}
    </>
  );
};
