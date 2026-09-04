import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CreditCard, 
  Search, 
  User, 
  ShieldCheck, 
  Phone, 
  MessageCircle, 
  FileText, 
  LogOut, 
  Menu, 
  X, 
  Sliders,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    siteSettings, 
    currentUser, 
    isAdmin, 
    currentView, 
    setCurrentView, 
    setAuthModalOpen, 
    setAuthModalTab, 
    setAdminLoginModalOpen, 
    logoutCustomer, 
    logoutAdmin,
    setTrackingModalOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200">
      {/* Top Notice Marquee & Emergency Helpdesk Bar */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4 font-medium flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 overflow-hidden mr-4">
          <span className="bg-blue-500 text-white text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wide shrink-0">
            NOTICE
          </span>
          <div className="truncate text-slate-300 text-[11px] md:text-xs">
            {siteSettings.noticeText}
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 shrink-0 text-slate-300 text-xs">
          <a href={`tel:${siteSettings.contactPhone}`} className="hover:text-white flex items-center gap-1 transition-colors">
            <Phone className="w-3.5 h-3.5 text-blue-400" />
            <span>{siteSettings.contactPhone}</span>
          </a>
          <a 
            href={`https://wa.me/${siteSettings.contactWhatsApp.replace(/[^0-9]/g, '')}`} 
            target="_blank" 
            rel="noreferrer" 
            className="hover:text-white flex items-center gap-1 text-emerald-400 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp Support</span>
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Branding */}
          <div 
            onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {siteSettings.logoUrl ? (
              <img 
                src={siteSettings.logoUrl} 
                alt={siteSettings.siteName} 
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-cover border-2 border-blue-600 shadow-sm group-hover:scale-105 transition-transform"
                onError={(e) => {
                  // Fallback if custom URL fails
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80';
                }}
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-sm">
                EZ
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                  {siteSettings.siteName}
                </span>
                <span className="hidden md:inline-flex items-center gap-0.5 bg-blue-50 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-blue-200">
                  <ShieldCheck className="w-3 h-3 text-blue-600" /> CSC Certified
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1 max-w-xs sm:max-w-md">
                {siteSettings.tagline}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                currentView === 'home' 
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60' 
                  : 'text-slate-700 hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView('services')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                currentView === 'services' 
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60' 
                  : 'text-slate-700 hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              All Services
            </button>
            <button
              onClick={() => setTrackingModalOpen(true)}
              className="px-3 py-2 text-sm font-semibold rounded-lg text-slate-700 hover:text-blue-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
            >
              <Search className="w-4 h-4 text-blue-600" />
              <span>Track PVC Card</span>
            </button>
            
            {currentUser && (
              <button
                onClick={() => setCurrentView('customer_portal')}
                className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  currentView === 'customer_portal' 
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60' 
                    : 'text-slate-700 hover:text-blue-700 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span>My Orders & Invoices</span>
              </button>
            )}
          </nav>

          {/* Action Buttons & Profile */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Customer Status */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('customer_portal')}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 leading-tight">{currentUser.fullName}</div>
                    <div className="text-[10px] text-blue-700 font-mono font-bold">{currentUser.customerCode}</div>
                  </div>
                </button>
                <button
                  onClick={logoutCustomer}
                  title="Logout Customer"
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setAuthModalTab('login'); setAuthModalOpen(true); }}
                  className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-blue-700 transition-colors"
                >
                  Customer Login
                </button>
                <button
                  onClick={() => { setAuthModalTab('register'); setAuthModalOpen(true); }}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm flex items-center gap-1.5 transition-all transform active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                  <span>Create Customer ID</span>
                </button>
              </div>
            )}

            {/* Admin Switch */}
            {isAdmin ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentView('admin_panel')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 ${
                    currentView === 'admin_panel' 
                      ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm' 
                      : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-950" />
                  <span>Admin Panel</span>
                </button>
                <button
                  onClick={logoutAdmin}
                  title="Exit Admin Mode"
                  className="p-1.5 text-amber-700 hover:text-red-700 hover:bg-amber-100 rounded"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAdminLoginModalOpen(true)}
                className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md border border-slate-200 transition-colors"
              >
                Admin
              </button>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setTrackingModalOpen(true)}
              className="p-2 text-blue-700 bg-blue-50 rounded-lg"
              title="Track Order"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          {currentUser ? (
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-800 font-semibold">Logged in as</p>
                <p className="text-sm font-bold text-slate-900">{currentUser.fullName}</p>
                <p className="text-xs font-mono font-bold text-blue-700">Customer ID: {currentUser.customerCode}</p>
              </div>
              <button
                onClick={logoutCustomer}
                className="text-xs font-bold text-red-600 bg-white border border-red-200 px-2.5 py-1.5 rounded-lg"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setAuthModalTab('login'); setAuthModalOpen(true); setMobileMenuOpen(false); }}
                className="w-full py-2.5 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg text-center"
              >
                Customer Login
              </button>
              <button
                onClick={() => { setAuthModalTab('register'); setAuthModalOpen(true); setMobileMenuOpen(false); }}
                className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 rounded-lg text-center shadow-sm"
              >
                Register Customer ID
              </button>
            </div>
          )}

          <div className="space-y-1 pt-2 border-t border-slate-100">
            <button
              onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              Home
            </button>
            <button
              onClick={() => { setCurrentView('services'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              All Services & PVC Cards
            </button>
            <button
              onClick={() => { setTrackingModalOpen(true); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 rounded-lg flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4" /> Track PVC Card / Order
              </span>
              <ChevronRight className="w-4 h-4 text-blue-400" />
            </button>
            {currentUser && (
              <button
                onClick={() => { setCurrentView('customer_portal'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                My Orders & Invoices
              </button>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100">
            {isAdmin ? (
              <button
                onClick={() => { setCurrentView('admin_panel'); setMobileMenuOpen(false); }}
                className="w-full py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg text-center"
              >
                Enter Admin Panel
              </button>
            ) : (
              <button
                onClick={() => { setAdminLoginModalOpen(true); setMobileMenuOpen(false); }}
                className="w-full py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg text-center"
              >
                Admin Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
