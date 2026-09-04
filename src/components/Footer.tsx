import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Truck, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  CreditCard, 
  ArrowRight, 
  CheckCircle2,
  Lock
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { siteSettings, setCurrentView, setTrackingModalOpen, setAdminLoginModalOpen } = useApp();

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800 mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 3 Trust Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Speed Post Pan-India Delivery</h4>
              <p className="text-xs text-slate-400 mt-1">
                Dispatched to all Indian states and districts with valid consignment tracking numbers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Direct UPI Payment & Tax Invoices</h4>
              <p className="text-xs text-slate-400 mt-1">
                Zero processing hassle. Pay via PhonePe, GPay, or Paytm with instant downloadable invoices.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Waterproof PVC Guaranteed</h4>
              <p className="text-xs text-slate-400 mt-1">
                800-micron high gloss thermal smart cards with scratch and UV resistance.
              </p>
            </div>
          </div>
        </div>

        {/* Middle Footer Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12 border-b border-slate-800 text-xs">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-white">
                {siteSettings.siteName}
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {siteSettings.tagline}
            </p>
            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">India Post Speed Post Certified</span>
              <span className="font-mono text-slate-300 font-semibold">Doorstep PVC Smart Delivery</span>
            </div>
          </div>

          {/* Quick Services */}
          <div className="space-y-2">
            <h5 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Popular PVC Cards</h5>
            <ul className="space-y-1.5 text-slate-400">
              <li><button onClick={() => setCurrentView('services')} className="hover:text-blue-400 transition-colors">Aadhaar PVC Smart Card</button></li>
              <li><button onClick={() => setCurrentView('services')} className="hover:text-blue-400 transition-colors">Voter ID (EPIC) PVC Card</button></li>
              <li><button onClick={() => setCurrentView('services')} className="hover:text-blue-400 transition-colors">Instant PAN Card PVC Print</button></li>
              <li><button onClick={() => setCurrentView('services')} className="hover:text-blue-400 transition-colors">Driving Licence Smart Card</button></li>
              <li><button onClick={() => setCurrentView('services')} className="hover:text-blue-400 transition-colors">Ayushman Bharat (ABHA) Card</button></li>
            </ul>
          </div>

          {/* Quick Tools */}
          <div className="space-y-2">
            <h5 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Free Tools & Portals</h5>
            <ul className="space-y-1.5 text-slate-400">
              <li><button onClick={() => setCurrentView('free_tools')} className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">⚡ Free JPG to PDF Converter</button></li>
              <li><button onClick={() => setCurrentView('free_tools')} className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">⚡ Passport Size Photo Maker</button></li>
              <li><button onClick={() => setCurrentView('free_tools')} className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">⚡ PVC Smart Card Crop Tool</button></li>
              <li><button onClick={() => setTrackingModalOpen(true)} className="hover:text-blue-400 transition-colors">Track Speed Post Consignment</button></li>
              <li><button onClick={() => setCurrentView('customer_portal')} className="hover:text-blue-400 transition-colors">Customer Digital ID & Orders</button></li>
              <li><button onClick={() => setCurrentView('services')} className="hover:text-blue-400 transition-colors">Online Seva Services</button></li>
              <li><button onClick={() => setAdminLoginModalOpen(true)} className="hover:text-amber-400 transition-colors flex items-center gap-1">
                <Lock className="w-3 h-3" /> Admin Control Panel
              </button></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Helpline & Support</h5>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{siteSettings.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>WhatsApp: {siteSettings.contactWhatsApp}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{siteSettings.contactEmail}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed text-slate-400">{siteSettings.officeAddress}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {siteSettings.siteName}. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span>India Post Postal Certified Delivery</span>
            <span>•</span>
            <span>CSC Digital Seva Certified</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
