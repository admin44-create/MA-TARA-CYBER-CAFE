import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  UserCheck,
  Award
} from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { siteSettings, openTrackingForOrder, setCurrentView, currentUser, setAuthModalOpen, setAuthModalTab } = useApp();
  const [quickTrackInput, setQuickTrackInput] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTrackInput.trim()) {
      openTrackingForOrder(quickTrackInput.trim());
    }
  };

  return (
    <div className="relative overflow-hidden bg-slate-950 text-white geometric-grid-dark border-b border-slate-800">
      {/* Background Banner Image with JPG & Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-20"
        style={{ backgroundImage: `url(${siteSettings.bannerImageUrl})` }}
      />
      
      {/* Decorative Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-blue-950/70 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{siteSettings.bannerBadge}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {siteSettings.bannerHeadline}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
              {siteSettings.bannerSubheadline}
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-medium text-slate-200">100% Waterproof PVC</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-medium text-slate-200">Speed Post Tracking</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 col-span-2 sm:col-span-1">
                <CreditCard className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-xs font-medium text-slate-200">Instant UPI & Invoice</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setCurrentView('services')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3 rounded-xl shadow-md flex items-center gap-2 transition-all transform active:scale-95"
              >
                <span>Browse PVC Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentView('free_tools')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-3 rounded-xl shadow-md flex items-center gap-2 transition-all transform active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Free Citizen Tools (JPG to PDF / Crop)</span>
              </button>

              {!currentUser ? (
                <button
                  onClick={() => { setAuthModalTab('register'); setAuthModalOpen(true); }}
                  className="bg-slate-900/80 hover:bg-slate-800 text-white font-bold px-5 py-3 rounded-xl border border-slate-700 backdrop-blur-md flex items-center gap-2 transition-colors text-sm"
                >
                  <UserCheck className="w-4 h-4 text-blue-400" />
                  <span>Create Customer ID</span>
                </button>
              ) : (
                <button
                  onClick={() => setCurrentView('customer_portal')}
                  className="bg-blue-900/60 hover:bg-blue-900 text-blue-200 font-bold px-5 py-3 rounded-xl border border-blue-500/40 backdrop-blur-md flex items-center gap-2 transition-colors text-xs"
                >
                  <span>My ID: {currentUser.customerCode}</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Live Track Card Widget directly in Hero */}
          <div className="lg:col-span-5">
            <div className="geometric-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Quick PVC Tracking</h3>
                    <p className="text-[11px] text-slate-500">Real-time Speed Post & Order status</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full">
                  Live Sync
                </span>
              </div>

              <form onSubmit={handleTrackSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Enter Tracking No. / Consignment No. / Order ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={quickTrackInput}
                      onChange={(e) => setQuickTrackInput(e.target.value)}
                      placeholder="e.g. EZTRACK-782194 or ORD-98241"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!quickTrackInput.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
                >
                  <Search className="w-4 h-4" />
                  <span>Track Status Now</span>
                </button>
              </form>

              {/* Privacy Notice: No public order leakage */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>100% Privacy Protected:</strong> Orders and citizen data are strictly confidential. Only visible to you in your Customer Portal and the Admin Panel.</span>
                </div>
              </div>

              {/* Notice regarding Customer ID */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
                <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong className="font-bold">Important Notice:</strong> Valid Customer ID registration is required before placing any PVC card or digital service order.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
