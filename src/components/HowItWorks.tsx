import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  UserPlus, 
  UploadCloud, 
  QrCode, 
  Truck, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle,
  FileText
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { setAuthModalOpen, setAuthModalTab, currentUser, setCurrentView } = useApp();

  const steps = [
    {
      num: '01',
      icon: <UserPlus className="w-6 h-6 text-emerald-600" />,
      title: '1. Register Customer ID',
      desc: 'Create your unique Customer ID with state & district. Required before ordering any Seva service.'
    },
    {
      num: '02',
      icon: <UploadCloud className="w-6 h-6 text-cyan-600" />,
      title: '2. Select Service & Upload',
      desc: 'Choose Aadhaar, Voter, PAN or Ayushman PVC card, select quantity and upload e-Card PDF or number.'
    },
    {
      num: '03',
      icon: <QrCode className="w-6 h-6 text-amber-600" />,
      title: '3. Scan UPI QR & Enter UTR',
      desc: 'Scan the live UPI QR code with PhonePe, GPay, or Paytm, and enter the 12-digit UTR reference number.'
    },
    {
      num: '04',
      icon: <Truck className="w-6 h-6 text-purple-600" />,
      title: '4. Instant Invoice & Tracking',
      desc: 'Instantly download your official tax invoice. Track doorstep speed post consignment in real-time.'
    }
  ];

  return (
    <section className="py-16 bg-slate-100/70 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            Simple 4-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
            How to Order PVC Smart Cards Online
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Fully automated workflow with verified UPI payment confirmation and direct India Post Speed Post consignment dispatch.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative group hover:border-emerald-500/50 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {s.icon}
                </div>
                <span className="font-mono text-2xl font-black text-slate-300 group-hover:text-emerald-500 transition-colors">
                  {s.num}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-slate-900 mb-2">
                {s.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA banner under steps */}
        <div className="mt-12 bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-emerald-400/30">
              Instant Activation
            </span>
            <h3 className="text-xl sm:text-2xl font-black mt-2">Ready to order your Smart PVC Card?</h3>
            <p className="text-xs text-slate-300 mt-1">
              Waterproof 800-micron plastic card delivered with India Post Speed Post.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {!currentUser ? (
              <button
                onClick={() => { setAuthModalTab('register'); setAuthModalOpen(true); }}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black px-6 py-3 rounded-xl shadow transition-all transform active:scale-95"
              >
                Create Customer ID Now
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('services')}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black px-6 py-3 rounded-xl shadow transition-all transform active:scale-95"
              >
                Browse & Order Now
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
