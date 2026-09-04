import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Service, ServiceCategory } from '../types';
import { 
  CreditCard, 
  Vote, 
  FileCheck, 
  Car, 
  ShieldAlert, 
  Receipt, 
  Award, 
  Baby, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  Search, 
  Filter,
  Lock,
  Sparkles,
  Info,
  FileText,
  KeyRound,
  Compass,
  Building,
  HeartPulse,
  Landmark,
  GraduationCap,
  Banknote,
  Zap,
  Fuel,
  Train,
  Plane,
  Briefcase,
  MessageCircle
} from 'lucide-react';
import { getWhatsAppChatUrl, buildServiceInquiryMessage } from '../utils/whatsapp';

const ICON_MAP: Record<string, React.ReactNode> = {
  CreditCard: <CreditCard className="w-6 h-6" />,
  Vote: <Vote className="w-6 h-6" />,
  FileCheck: <FileCheck className="w-6 h-6" />,
  Car: <Car className="w-6 h-6" />,
  ShieldAlert: <ShieldAlert className="w-6 h-6" />,
  Receipt: <Receipt className="w-6 h-6" />,
  Award: <Award className="w-6 h-6" />,
  Baby: <Baby className="w-6 h-6" />,
  FileText: <FileText className="w-6 h-6" />,
  KeyRound: <KeyRound className="w-6 h-6" />,
  Compass: <Compass className="w-6 h-6" />,
  Building: <Building className="w-6 h-6" />,
  HeartPulse: <HeartPulse className="w-6 h-6" />,
  Landmark: <Landmark className="w-6 h-6" />,
  GraduationCap: <GraduationCap className="w-6 h-6" />,
  Banknote: <Banknote className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  Fuel: <Fuel className="w-6 h-6" />,
  Train: <Train className="w-6 h-6" />,
  Plane: <Plane className="w-6 h-6" />,
  Briefcase: <Briefcase className="w-6 h-6" />
};

export const ServicesGrid: React.FC = () => {
  const { services, openOrderForService, currentUser, siteSettings, setAuthModalOpen, setAuthModalTab } = useApp();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredServices = services.filter(service => {
    if (!service.active) return false;
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'pvc_card', label: '🪪 Smart PVC Cards' },
    { id: 'document', label: '📑 Identity & Forms' },
    { id: 'certificate', label: '📜 Certificates & Schemes' },
    { id: 'utility', label: '⚡ Utilities & Banking' },
  ];

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Govt & Digital Kendra Services</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Order High Quality Smart PVC Cards & Services
          </h2>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            Choose your required service. Free replacement guarantee on damaged PVC cards, with dedicated speed post consignment tracking.
          </p>
        </div>

        {/* Customer ID Notice Pill */}
        {!currentUser && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center gap-2 max-w-md">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Customer ID is mandatory to place orders.{' '}
              <button 
                onClick={() => { setAuthModalTab('register'); setAuthModalOpen(true); }}
                className="underline font-bold text-amber-950 hover:text-blue-700"
              >
                Create your ID here &rarr;
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 geometric-card p-3 mb-8">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search PVC cards, services..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Grid of Services */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-16 geometric-card">
          <Info className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No services found</h3>
          <p className="text-sm text-slate-500 mt-1">Try clearing your search query or selecting another category.</p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-blue-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const icon = ICON_MAP[service.iconName] || <CreditCard className="w-6 h-6" />;
            const isPvc = service.category === 'pvc_card';

            return (
              <div
                key={service.id}
                className="geometric-card hover:border-blue-500/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6">
                  {/* Card Header & Badge */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      {icon}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {service.badge && (
                        <span className="bg-amber-50 text-amber-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-amber-200">
                          {service.badge}
                        </span>
                      )}
                      {isPvc && (
                        <span className="bg-blue-50 text-blue-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border border-blue-200">
                          Smart PVC
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Turnaround & Key Specs */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{service.turnaroundTime}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                      Speed Post Delivery
                    </span>
                  </div>

                  {/* Required Documents Checklist */}
                  {service.requiredDocs && service.requiredDocs.length > 0 && (
                    <div className="mt-3 bg-slate-50 rounded-xl p-2.5 border border-slate-200/70">
                      <div className="text-[11px] font-bold text-slate-700 mb-1">Required for Order:</div>
                      <div className="space-y-1">
                        {service.requiredDocs.slice(0, 2).map((doc, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                            <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span className="truncate">{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Pricing & CTA */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-medium text-slate-500 block uppercase tracking-wider">Starting from</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900">₹{service.price}</span>
                      <span className="text-[11px] text-slate-500">/ card</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={getWhatsAppChatUrl(
                        siteSettings.contactWhatsApp, 
                        buildServiceInquiryMessage(service, siteSettings.siteName, currentUser)
                      )}
                      target="_blank"
                      rel="noreferrer"
                      title="Enquire or send documents on WhatsApp"
                      className="p-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => openOrderForService(service)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all transform active:scale-95"
                    >
                      <span>{isPvc ? 'Order PVC Card' : 'Apply Online'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
