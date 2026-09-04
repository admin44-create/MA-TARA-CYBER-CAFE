import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ServicesGrid } from './components/ServicesGrid';
import { HowItWorks } from './components/HowItWorks';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { OrderModal } from './components/OrderModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { InvoiceModal } from './components/InvoiceModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { SpeedPostReceiptModal } from './components/SpeedPostReceiptModal';
import { FreeTools } from './components/FreeTools';
import { AiAssistant } from './components/AiAssistant';
import { WhatsAppWidget } from './components/WhatsAppWidget';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroBanner />
            <ServicesGrid />
            <HowItWorks />
          </>
        )}

        {currentView === 'services' && (
          <div className="pt-4">
            <ServicesGrid />
          </div>
        )}

        {currentView === 'free_tools' && (
          <FreeTools />
        )}

        {currentView === 'customer_portal' && (
          <CustomerDashboard />
        )}

        {currentView === 'admin_panel' && (
          <AdminPanel />
        )}
      </main>

      {/* Portal Footer */}
      <Footer />

      {/* AI Assistant & WhatsApp Floating Integrations */}
      <AiAssistant />
      <WhatsAppWidget />

      {/* All Application Modals */}
      <AuthModal />
      <OrderModal />
      <OrderTrackingModal />
      <InvoiceModal />
      <SpeedPostReceiptModal />
      <AdminLoginModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
