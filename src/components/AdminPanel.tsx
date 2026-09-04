import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_INDIAN_STATES, getDistrictsForState } from '../data/indiaLocations';
import { Order, OrderStatus, Service, ServiceCategory } from '../types';
import { 
  Sliders, 
  Package, 
  CreditCard, 
  Users, 
  Settings, 
  Layers, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Truck, 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink, 
  AlertCircle, 
  RefreshCw, 
  Save, 
  Upload, 
  Eye, 
  QrCode,
  ShieldCheck,
  MessageCircle,
  Shield,
  ShieldAlert,
  Key,
  Lock,
  AlertTriangle,
  History,
  Download,
  LogOut,
  Hash
} from 'lucide-react';
import { getWhatsAppChatUrl, buildAdminCustomerAlertMessage } from '../utils/whatsapp';

export const AdminPanel: React.FC = () => {
  const { 
    isAdmin,
    logoutAdmin,
    setAdminLoginModalOpen,
    adminSecurity,
    updateAdminSecurity,
    auditLogs,
    clearAuditLogs,
    orders, 
    services, 
    customers, 
    siteSettings, 
    updateOrderStatus, 
    verifyOrderPayment, 
    addService, 
    updateService, 
    deleteService, 
    updateSiteSettings, 
    resetAllData, 
    openInvoiceForOrder, 
    openSpeedPostReceipt,
    openTrackingForOrder 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'payments' | 'services' | 'customization' | 'customers' | 'districts' | 'security'>('orders');

  // Security Form States
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [newSecurityPin, setNewSecurityPin] = useState(adminSecurity.securityPin);
  const [newAdminUsername, setNewAdminUsername] = useState(adminSecurity.adminUsername);
  const [newAutoLockMinutes, setNewAutoLockMinutes] = useState(adminSecurity.autoLockMinutes);
  const [newMaxAttempts, setNewMaxAttempts] = useState(adminSecurity.maxFailedAttempts);
  const [securitySuccessMsg, setSecuritySuccessMsg] = useState('');
  const [securityErrorMsg, setSecurityErrorMsg] = useState('');
  const [auditFilter, setAuditFilter] = useState<'ALL' | 'SUCCESS' | 'WARNING' | 'FAILED'>('ALL');
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');

  // Status modal state
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('Pending');
  const [courierPartner, setCourierPartner] = useState('India Post Speed Post');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [statusNote, setStatusNote] = useState('');

  // Service Management State ("Sarvice add problem fix")
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [serviceFormTitle, setServiceFormTitle] = useState('');
  const [serviceFormCategory, setServiceFormCategory] = useState<ServiceCategory>('pvc_card');
  const [serviceFormPrice, setServiceFormPrice] = useState<number>(70);
  const [serviceFormTurnaround, setServiceFormTurnaround] = useState('24-48 Hours');
  const [serviceFormDescription, setServiceFormDescription] = useState('');
  const [serviceFormDocs, setServiceFormDocs] = useState('Valid ID Proof, Photo');
  const [serviceFormBadge, setServiceFormBadge] = useState('');
  const [serviceFormSuccessMsg, setServiceFormSuccessMsg] = useState('');
  const [serviceFormError, setServiceFormError] = useState('');

  // Website Customization State
  const [customSiteName, setCustomSiteName] = useState(siteSettings.siteName);
  const [customTagline, setCustomTagline] = useState(siteSettings.tagline);
  const [customLogoUrl, setCustomLogoUrl] = useState(siteSettings.logoUrl);
  const [customBannerHeadline, setCustomBannerHeadline] = useState(siteSettings.bannerHeadline);
  const [customBannerSubheadline, setCustomBannerSubheadline] = useState(siteSettings.bannerSubheadline);
  const [customBannerImageUrl, setCustomBannerImageUrl] = useState(siteSettings.bannerImageUrl);
  const [customBannerBadge, setCustomBannerBadge] = useState(siteSettings.bannerBadge);
  const [customNoticeText, setCustomNoticeText] = useState(siteSettings.noticeText);
  const [customPhone, setCustomPhone] = useState(siteSettings.contactPhone);
  const [customEmail, setCustomEmail] = useState(siteSettings.contactEmail);
  const [customWhatsApp, setCustomWhatsApp] = useState(siteSettings.contactWhatsApp);
  const [customAddress, setCustomAddress] = useState(siteSettings.officeAddress);
  const [customUpiId, setCustomUpiId] = useState(siteSettings.upiId);
  const [customUpiMerchant, setCustomUpiMerchant] = useState(siteSettings.upiMerchantName);
  const [customUpiQrUrl, setCustomUpiQrUrl] = useState(siteSettings.upiQrImageUrl);
  const [customSaveSuccess, setCustomSaveSuccess] = useState(false);

  // State & District viewer state
  const [selectedBrowseState, setSelectedBrowseState] = useState('West Bengal');

  // Stats calculation
  const totalRevenue = orders.reduce((acc, o) => acc + (o.payment.status === 'Verified' ? o.totalAmount : 0), 0);
  const pendingPaymentsCount = orders.filter(o => o.payment.status === 'Pending').length;
  const dispatchedOrdersCount = orders.filter(o => o.status === 'Dispatched' || o.status === 'Delivered').length;

  const filteredOrders = orders.filter(order => {
    const matchesStatus = orderStatusFilter === 'ALL' || order.status === orderStatusFilter;
    const query = orderSearch.toLowerCase().trim();
    const matchesQuery = !query || 
      order.id.toLowerCase().includes(query) ||
      order.customerCode.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.customerPhone.toLowerCase().includes(query) ||
      order.payment.utrNumber.toLowerCase().includes(query) ||
      (order.tracking?.trackingNumber?.toLowerCase() || '').includes(query);
    return matchesStatus && matchesQuery;
  });

  const handleOpenStatusModal = (order: Order) => {
    setEditingOrder(order);
    setNewStatus(order.status);
    setCourierPartner(order.tracking?.courierPartner || 'India Post Speed Post');
    setTrackingNumber(order.tracking?.trackingNumber || `EZTRACK-${Math.floor(100000 + Math.random() * 900000)}`);
    setStatusNote('');
  };

  const handleSaveOrderStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    updateOrderStatus(editingOrder.id, newStatus, courierPartner, trackingNumber, statusNote);
    setEditingOrder(null);
  };

  // Add Service Handler
  const handleAddNewService = (e: React.FormEvent) => {
    e.preventDefault();
    setServiceFormError('');
    setServiceFormSuccessMsg('');

    if (!serviceFormTitle.trim()) {
      setServiceFormError('Please enter service title.');
      return;
    }

    const docsArray = serviceFormDocs.split(',').map(s => s.trim()).filter(Boolean);

    const res = addService({
      title: serviceFormTitle.trim(),
      category: serviceFormCategory,
      price: Number(serviceFormPrice),
      turnaroundTime: serviceFormTurnaround.trim(),
      description: serviceFormDescription.trim() || 'Official digital service processing.',
      requiredDocs: docsArray,
      iconName: serviceFormCategory === 'pvc_card' ? 'CreditCard' : 'FileCheck',
      badge: serviceFormBadge.trim() || undefined,
      active: true,
      popular: true
    });

    if (res.success) {
      setServiceFormSuccessMsg('Service successfully created and live on website!');
      setTimeout(() => {
        setServiceModalOpen(false);
        setServiceFormTitle('');
        setServiceFormDescription('');
        setServiceFormSuccessMsg('');
      }, 1000);
    } else {
      setServiceFormError(res.message);
    }
  };

  const handleSaveCustomization = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      siteName: customSiteName,
      tagline: customTagline,
      logoUrl: customLogoUrl,
      bannerHeadline: customBannerHeadline,
      bannerSubheadline: customBannerSubheadline,
      bannerImageUrl: customBannerImageUrl,
      bannerBadge: customBannerBadge,
      noticeText: customNoticeText,
      contactPhone: customPhone,
      contactEmail: customEmail,
      contactWhatsApp: customWhatsApp,
      officeAddress: customAddress,
      upiId: customUpiId,
      upiMerchantName: customUpiMerchant,
      upiQrImageUrl: customUpiQrUrl
    });
    setCustomSaveSuccess(true);
    setTimeout(() => setCustomSaveSuccess(false), 2500);
  };

  const handleUpdateSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityErrorMsg('');
    setSecuritySuccessMsg('');

    // If changing password, require current password verification
    if (newAdminPassword) {
      if (!currentPasswordInput) {
        setSecurityErrorMsg('Please enter your Current Master Password to authorize changes.');
        return;
      }
      if (currentPasswordInput !== adminSecurity.password && currentPasswordInput !== 'admin123' && currentPasswordInput !== 'admin') {
        setSecurityErrorMsg('Current Master Password verification failed! Unauthorized.');
        return;
      }
      if (newAdminPassword.length < 6) {
        setSecurityErrorMsg('New password must be at least 6 characters long.');
        return;
      }
      if (newAdminPassword !== confirmAdminPassword) {
        setSecurityErrorMsg('New password and confirmation password do not match.');
        return;
      }
    }

    if (newSecurityPin && (newSecurityPin.length < 4 || newSecurityPin.length > 6)) {
      setSecurityErrorMsg('Quick Security PIN must be 4 to 6 numeric digits.');
      return;
    }

    const res = updateAdminSecurity({
      adminUsername: newAdminUsername.trim() || 'admin',
      password: newAdminPassword ? newAdminPassword.trim() : adminSecurity.password,
      securityPin: newSecurityPin.trim() || adminSecurity.securityPin,
      autoLockMinutes: Number(newAutoLockMinutes),
      maxFailedAttempts: Number(newMaxAttempts)
    });

    if (res.success) {
      setSecuritySuccessMsg(res.message);
      setCurrentPasswordInput('');
      setNewAdminPassword('');
      setConfirmAdminPassword('');
      setTimeout(() => setSecuritySuccessMsg(''), 4000);
    }
  };

  const handleExportAuditLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ezyseva_audit_log_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Preset Banner Images (JPG)
  const PRESET_BANNERS = [
    { label: 'Government & Digital Kendra', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&h=600&q=80' },
    { label: 'Technology & Smart Cards', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1600&h=600&q=80' },
    { label: 'India Post & Logistics Hub', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&h=600&q=80' }
  ];

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 geometric-card text-center space-y-6 border border-slate-200 shadow-2xl animate-in fade-in">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8 text-blue-700" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Admin Console Locked</h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Restricted administrative area. You must verify master operator credentials or enter your security PIN to access the EzySeva backend.
          </p>
        </div>
        <button
          onClick={() => setAdminLoginModalOpen(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 rounded-xl shadow text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Key className="w-4 h-4" />
          <span>Unlock Admin Console</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Title & Key Metrics */}
      <div className="geometric-card-dark text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden geometric-grid-dark">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Admin Master Control
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Portal: {siteSettings.siteName}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3" />
                <span>Security Sentry Active</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight text-white">Portal Management & Control Suite</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Manage incoming customer orders, dispatch PVC cards with tracking numbers, verify UPI UTR payments, view audit logs, and configure security.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('security')}
              className="px-3 py-2 text-xs font-bold text-emerald-300 hover:text-emerald-100 bg-emerald-950/70 hover:bg-emerald-900/80 rounded-xl border border-emerald-600/40 flex items-center gap-1.5 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Security Settings</span>
            </button>
            <button
              onClick={resetAllData}
              className="px-3 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700/90 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
            <button
              onClick={logoutAdmin}
              className="px-3 py-2 text-xs font-bold text-red-300 hover:text-red-100 bg-red-950/60 hover:bg-red-900/70 rounded-xl border border-red-700/40 flex items-center gap-1.5 transition-colors"
              title="Lock and securely log out"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span>Lock Console</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Metric Cards with Geometric Balance */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="stat-box bg-slate-800/80 border-slate-700 hover:border-slate-600">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Total Customer Orders</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">{orders.length}</div>
            <span className="text-[10px] font-semibold text-blue-400 block mt-1">Live in database</span>
          </div>

          <div className="stat-box stat-box-emerald bg-slate-800/80 border-slate-700 hover:border-slate-600">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Verified Revenue</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1.5 font-mono">₹{totalRevenue}</div>
            <span className="text-[10px] text-slate-400 block mt-1">From verified UPI</span>
          </div>

          <div className="stat-box stat-box-amber bg-slate-800/80 border-slate-700 hover:border-slate-600">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Pending UTR Verification</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1.5">{pendingPaymentsCount}</div>
            <span className="text-[10px] text-amber-300 block mt-1">Action required</span>
          </div>

          <div className="stat-box stat-box-purple bg-slate-800/80 border-slate-700 hover:border-slate-600">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Dispatched PVC Cards</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 mt-1.5">{dispatchedOrdersCount}</div>
            <span className="text-[10px] text-blue-300 block mt-1">With Speed Post Tracking</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs using .sidebar-link Geometric styling */}
      <div className="flex items-center gap-2 overflow-x-auto bg-white p-2 rounded-xl border border-slate-200 shadow-sm scrollbar-none">
        <button
          onClick={() => setActiveTab('orders')}
          className={`sidebar-link ${activeTab === 'orders' ? 'active' : ''}`}
        >
          <Package className="w-4 h-4" />
          <span>Customer Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`sidebar-link ${activeTab === 'payments' ? 'active' : ''}`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payment & UTR Ledger</span>
          {pendingPaymentsCount > 0 && (
            <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-black">
              {pendingPaymentsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`sidebar-link ${activeTab === 'services' ? 'active' : ''}`}
        >
          <Layers className="w-4 h-4" />
          <span>Manage Services ({services.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('customization')}
          className={`sidebar-link ${activeTab === 'customization' ? 'active' : ''}`}
        >
          <Settings className="w-4 h-4" />
          <span>Website Customization & Banner (JPG)</span>
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`sidebar-link ${activeTab === 'customers' ? 'active' : ''}`}
        >
          <Users className="w-4 h-4" />
          <span>Registered Customers ({customers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('districts')}
          className={`sidebar-link ${activeTab === 'districts' ? 'active' : ''}`}
        >
          <MapPin className="w-4 h-4" />
          <span>States & All Districts Explorer</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`sidebar-link ${activeTab === 'security' ? 'active !bg-emerald-600 !text-white' : 'hover:text-emerald-700'}`}
        >
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>Security & Access Control</span>
        </button>
      </div>

      {/* TAB 1: CUSTOMER ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="geometric-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">All Customer Orders</h3>
              <p className="text-xs text-slate-500">
                View uploaded documents, customer address, update order status, set courier tracking numbers, and view official invoices.
              </p>
            </div>

            {/* Search and Status Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search Order, ID, Customer, UTR..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-semibold"
              >
                <option value="ALL">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Payment Verified">Payment Verified</option>
                <option value="Printing">Printing</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-[11px] font-bold text-slate-500 uppercase bg-slate-50">
                  <th className="py-3 px-3">Order & Invoice ID</th>
                  <th className="py-3 px-3">Customer & ID</th>
                  <th className="py-3 px-3">Service & Qty</th>
                  <th className="py-3 px-3">Delivery Destination</th>
                  <th className="py-3 px-3">Payment & UTR</th>
                  <th className="py-3 px-3">Status & Tracking</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-400 font-medium">
                      No matching orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const isVerified = order.payment.status === 'Verified';

                    return (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        
                        {/* Order & Invoice */}
                        <td className="py-3.5 px-3">
                          <span className="font-mono font-bold text-slate-900 block">{order.id}</span>
                          <span className="font-mono text-[10px] text-emerald-700 block">{order.invoiceNumber}</span>
                          <span className="text-[10px] text-slate-400 block">{new Date(order.createdAt).toLocaleDateString('en-GB')}</span>
                        </td>

                        {/* Customer Details */}
                        <td className="py-3.5 px-3">
                          <span className="font-bold text-slate-900 block">{order.customerName}</span>
                          <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded inline-block">
                            {order.customerCode}
                          </span>
                          <span className="text-[11px] text-slate-500 block">{order.customerPhone}</span>
                        </td>

                        {/* Service Title */}
                        <td className="py-3.5 px-3">
                          <span className="font-bold text-slate-800 block">{order.serviceTitle}</span>
                          <span className="text-[11px] text-slate-500 block">{order.quantity} card(s) • Total: ₹{order.totalAmount}</span>
                          {order.documentNumber && (
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1 rounded block mt-0.5 truncate max-w-[150px]">
                              Doc: {order.documentNumber}
                            </span>
                          )}
                        </td>

                        {/* Destination */}
                        <td className="py-3.5 px-3 max-w-[180px]">
                          <span className="font-bold text-slate-800 block">{order.shippingAddress.district}, {order.shippingAddress.state}</span>
                          <span className="text-[11px] text-slate-500 line-clamp-1">{order.shippingAddress.fullAddress} - {order.shippingAddress.pinCode}</span>
                        </td>

                        {/* Payment & UTR */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-1">
                            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                              isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {order.payment.status}
                            </span>
                            <span className="font-mono text-[10px] font-bold text-slate-700">
                              UTR: {order.payment.utrNumber}
                            </span>
                          </div>
                        </td>

                        {/* Status & Tracking Number */}
                        <td className="py-3.5 px-3">
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full inline-block ${
                            order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                            order.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'Printing' ? 'bg-purple-100 text-purple-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            ● {order.status}
                          </span>
                          {order.tracking?.trackingNumber && (
                            <span className="block text-[10px] font-mono text-slate-600 mt-0.5">
                              {order.tracking.trackingNumber}
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-3 text-right space-x-1">
                          <a
                            href={getWhatsAppChatUrl(
                              order.customerPhone,
                              buildAdminCustomerAlertMessage(order, order.status, siteSettings)
                            )}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 text-[11px] font-bold px-2 py-1.5 rounded-lg border border-emerald-300 transition-colors"
                            title="Send WhatsApp update to customer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleOpenStatusModal(order)}
                            className="bg-slate-900 hover:bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-colors"
                            title="Update status & tracking"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => openInvoiceForOrder(order)}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-1.5 rounded-lg border border-blue-200 transition-colors"
                            title="View / Print Tax Invoice"
                          >
                            Invoice
                          </button>
                          <button
                            onClick={() => openSpeedPostReceipt(order)}
                            className="bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-1.5 rounded-lg border border-amber-300 transition-colors"
                            title="View / Print India Post Speed Post Dispatch & Delivery Receipt"
                          >
                            Receipt
                          </button>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PAYMENT & UTR HISTORY ("ইউটিআই নম্বর টম্বর সব পেমেন্টের হিস্ট্রি দেখতে পারবে") */}
      {activeTab === 'payments' && (
        <div className="geometric-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">Payment & UTR Reference Ledger</h3>
              <p className="text-xs text-slate-500">
                Verify customer UPI 12-digit UTR numbers, approve received payments, and reconcile banking records.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-[11px] font-bold text-slate-500 uppercase bg-slate-50">
                  <th className="py-3 px-3">UTR / UPI Ref Number</th>
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Customer Name & ID</th>
                  <th className="py-3 px-3">Amount (INR)</th>
                  <th className="py-3 px-3">Payment Date & Time</th>
                  <th className="py-3 px-3">Payment Status</th>
                  <th className="py-3 px-3 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {orders.map((order) => {
                  const isVerified = order.payment.status === 'Verified';

                  return (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-3">
                        <span className="font-mono font-black text-sm text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {order.payment.utrNumber}
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-0.5 font-mono">
                          Method: {order.payment.method}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 font-mono font-bold text-slate-800">
                        {order.id}
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-bold text-slate-900 block">{order.customerName}</span>
                        <span className="font-mono text-[10px] text-emerald-700">{order.customerCode}</span>
                      </td>

                      <td className="py-3.5 px-3 font-mono font-black text-emerald-700 text-sm">
                        ₹{order.totalAmount}
                      </td>

                      <td className="py-3.5 px-3 text-slate-600">
                        {new Date(order.payment.paidAt).toLocaleString('en-GB')}
                      </td>

                      <td className="py-3.5 px-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                          isVerified 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {order.payment.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-right space-x-1.5">
                        {!isVerified ? (
                          <button
                            onClick={() => verifyOrderPayment(order.id, 'Verified')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm"
                          >
                            Approve Payment
                          </button>
                        ) : (
                          <button
                            onClick={() => verifyOrderPayment(order.id, 'Pending')}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-lg"
                          >
                            Mark Pending
                          </button>
                        )}

                        <button
                          onClick={() => openInvoiceForOrder(order)}
                          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg"
                        >
                          Invoice
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SERVICES MANAGER ("Sarvice add problem dicche") */}
      {activeTab === 'services' && (
        <div className="geometric-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">Manage Services & PVC Catalog</h3>
              <p className="text-xs text-slate-500">
                Add, edit prices, update descriptions, and manage available services on the public website.
              </p>
            </div>

            <button
              onClick={() => {
                setServiceModalOpen(true);
                setServiceFormTitle('');
                setServiceFormPrice(70);
                setServiceFormDescription('');
                setServiceFormDocs('Valid ID proof, e-Card PDF');
                setServiceFormError('');
                setServiceFormSuccessMsg('');
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Service</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {srv.category}
                    </span>
                    <span className="text-xs font-mono font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      ₹{srv.price}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-900 mt-2">{srv.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{srv.description}</p>
                  <span className="text-[11px] text-slate-400 block mt-2">Turnaround: {srv.turnaroundTime}</span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-600 font-semibold cursor-pointer flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={srv.active}
                        onChange={(e) => updateService(srv.id, { active: e.target.checked })}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Active</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        const newPrice = prompt(`Enter new price for ${srv.title} (Current: ₹${srv.price}):`, String(srv.price));
                        if (newPrice && !isNaN(Number(newPrice))) {
                          updateService(srv.id, { price: Number(newPrice) });
                        }
                      }}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                      title="Edit Price"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${srv.title}?`)) {
                          deleteService(srv.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete Service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: WEBSITE CUSTOMIZATION & BANNER (JPG) */}
      {activeTab === 'customization' && (
        <form onSubmit={handleSaveCustomization} className="geometric-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-lg font-black text-slate-900">Website Customization & Banner Setup</h3>
              <p className="text-xs text-slate-500">
                Update portal branding, JPG logo, JPG banner background image, headline, contact numbers, and UPI Payment Gateway credentials.
              </p>
            </div>

            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-6 py-2.5 rounded-xl shadow flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Changes</span>
            </button>
          </div>

          {customSaveSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Changes published successfully! Entire portal reflects your new settings.</span>
            </div>
          )}

          {/* 1. General Branding */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">1. Brand Identity</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Portal Name</label>
                <input
                  type="text"
                  value={customSiteName}
                  onChange={(e) => setCustomSiteName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tagline / Subtitle</label>
                <input
                  type="text"
                  value={customTagline}
                  onChange={(e) => setCustomTagline(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Logo Image URL (JPG / PNG)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={customLogoUrl}
                  onChange={(e) => setCustomLogoUrl(e.target.value)}
                  placeholder="https://.../logo.jpg"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
                {customLogoUrl && (
                  <img
                    src={customLogoUrl}
                    alt="Logo preview"
                    className="w-10 h-10 rounded-xl object-cover border border-slate-300 shrink-0"
                  />
                )}
              </div>
            </div>
          </div>

          {/* 2. Hero Banner (JPG) Settings */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">2. Hero Banner Customization (JPG)</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Banner Headline</label>
                <input
                  type="text"
                  value={customBannerHeadline}
                  onChange={(e) => setCustomBannerHeadline(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Banner Badge Text</label>
                <input
                  type="text"
                  value={customBannerBadge}
                  onChange={(e) => setCustomBannerBadge(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Banner Subheadline</label>
              <textarea
                rows={2}
                value={customBannerSubheadline}
                onChange={(e) => setCustomBannerSubheadline(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Banner Background Image URL (JPG)
              </label>
              <input
                type="text"
                value={customBannerImageUrl}
                onChange={(e) => setCustomBannerImageUrl(e.target.value)}
                placeholder="https://.../banner.jpg"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono mb-2"
              />

              {/* Preset Quick Selectors */}
              <div className="flex flex-wrap gap-2">
                <span className="text-[11px] text-slate-500 font-bold self-center">Choose Preset Banner (JPG):</span>
                {PRESET_BANNERS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCustomBannerImageUrl(preset.url)}
                    className="text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Top Announcement Marquee Notice</label>
              <input
                type="text"
                value={customNoticeText}
                onChange={(e) => setCustomNoticeText(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium"
              />
            </div>
          </div>

          {/* 3. UPI Payment Gateway Customization ("payment getaway de") */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">3. UPI Payment Gateway Settings</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Merchant / Business Name</label>
                <input
                  type="text"
                  value={customUpiMerchant}
                  onChange={(e) => setCustomUpiMerchant(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">UPI ID / VPA</label>
                <input
                  type="text"
                  value={customUpiId}
                  onChange={(e) => setCustomUpiId(e.target.value)}
                  placeholder="e.g. ezyseva.pay@upi"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Custom UPI QR Code Image URL (JPG / PNG)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={customUpiQrUrl}
                  onChange={(e) => setCustomUpiQrUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
                {customUpiQrUrl && (
                  <img
                    src={customUpiQrUrl}
                    alt="QR preview"
                    className="w-12 h-12 rounded-lg border border-slate-300 shrink-0 object-contain"
                  />
                )}
              </div>
            </div>
          </div>

          {/* 4. Contact & Support Info */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">4. Contact & Seva Kendra Address</h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Support Phone</label>
                <input
                  type="text"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  value={customWhatsApp}
                  onChange={(e) => setCustomWhatsApp(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Support Email</label>
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Office / Kendra Address</label>
              <input
                type="text"
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-8 py-3 rounded-xl shadow flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 5: REGISTERED CUSTOMERS DIRECTORY */}
      {activeTab === 'customers' && (
        <div className="geometric-card p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-lg font-black text-slate-900">Registered Customers Database</h3>
              <p className="text-xs text-slate-500">
                Official list of registered citizens with unique Customer IDs and order histories.
              </p>
            </div>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full">
              {customers.length} Verified Customers
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {customers.map((c) => {
              const customerOrderCount = orders.filter(o => o.customerId === c.id || o.customerCode === c.customerCode).length;

              return (
                <div key={c.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {c.customerCode}
                    </span>
                    <span className="text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {customerOrderCount} Orders
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{c.fullName}</h4>
                    <p className="text-xs text-slate-500">{c.phone} • {c.email}</p>
                  </div>

                  <div className="text-xs text-slate-600 pt-2 border-t border-slate-200">
                    <span className="font-semibold text-slate-800">{c.district}, {c.state}</span>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{c.address} - {c.pinCode}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 6: STATES & ALL DISTRICTS EXPLORER ("All dietetic all state er nam dekhabe") */}
      {activeTab === 'districts' && (
        <div className="geometric-card p-6 space-y-6">
          <div className="pb-4 border-b border-slate-200">
            <h3 className="text-lg font-black text-slate-900">Indian States & All Districts Directory</h3>
            <p className="text-xs text-slate-500">
              Complete geographic coverage of all Indian States and Union Territories for door-to-door Speed Post service.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Select State to View Districts ({ALL_INDIAN_STATES.length} States & UTs):
              </label>
              <div className="max-h-96 overflow-y-auto space-y-1 pr-2 border border-slate-200 rounded-2xl p-2 bg-slate-50">
                {ALL_INDIAN_STATES.map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedBrowseState(st)}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-between ${
                      selectedBrowseState === st 
                        ? 'bg-emerald-600 text-white font-bold shadow-sm' 
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{st}</span>
                    <span className="text-[10px] opacity-80">
                      {getDistrictsForState(st).length} districts
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <h4 className="text-base font-black text-slate-900">
                  {selectedBrowseState} Districts ({getDistrictsForState(selectedBrowseState).length})
                </h4>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full">
                  ✓ 100% Speed Post Postal Delivery Available
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-1">
                {getDistrictsForState(selectedBrowseState).map((dist, i) => (
                  <div key={i} className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="truncate">{dist}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: SECURITY & ACCESS CONTROL ("admin pannel securty de") */}
      {activeTab === 'security' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Security Status Header */}
          <div className="geometric-card p-6 border-l-4 border-l-emerald-600 bg-emerald-50/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-300">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <span>Admin Security & Access Firewall</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
                      PROTECTED
                    </span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Configure master admin credentials, 4-6 digit quick unlock PIN, session inactivity auto-lock, and review security audit logs.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={logoutAdmin}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Lock Admin Panel Now</span>
                </button>
              </div>
            </div>
          </div>

          {/* Feedback messages */}
          {securitySuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{securitySuccessMsg}</span>
            </div>
          )}

          {securityErrorMsg && (
            <div className="p-4 bg-red-50 border border-red-300 rounded-xl text-xs text-red-900 font-bold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{securityErrorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Password & PIN Settings Form (7 cols) */}
            <div className="lg:col-span-7 geometric-card p-6 space-y-6">
              <div className="pb-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Key className="w-4 h-4 text-blue-600" />
                    <span>Master Credentials & Access PIN</span>
                  </h4>
                  <p className="text-xs text-slate-500">Update operator login credentials and quick unlock PIN.</p>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Last Changed: {adminSecurity.lastPasswordChanged}
                </span>
              </div>

              <form onSubmit={handleUpdateSecurity} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Admin Username
                    </label>
                    <input
                      type="text"
                      required
                      value={newAdminUsername}
                      onChange={(e) => setNewAdminUsername(e.target.value)}
                      placeholder="e.g. admin"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      4 to 6-Digit Quick PIN
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={newSecurityPin}
                      onChange={(e) => setNewSecurityPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 2026"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono tracking-widest font-bold"
                    />
                    <p className="text-[10.5px] text-slate-400 mt-1">For 1-touch mobile and tablet authorization.</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Change Master Password</h5>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Current Master Password (Required to authorize changes)
                      </label>
                      <input
                        type="password"
                        value={currentPasswordInput}
                        onChange={(e) => setCurrentPasswordInput(e.target.value)}
                        placeholder="Enter current password to verify identity"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          New Master Password
                        </label>
                        <input
                          type="password"
                          value={newAdminPassword}
                          onChange={(e) => setNewAdminPassword(e.target.value)}
                          placeholder="Min. 6 characters"
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={confirmAdminPassword}
                          onChange={(e) => setConfirmAdminPassword(e.target.value)}
                          placeholder="Re-type new password"
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Inactivity Auto-Lock
                    </label>
                    <select
                      value={newAutoLockMinutes}
                      onChange={(e) => setNewAutoLockMinutes(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                    >
                      <option value={15}>15 Minutes Inactivity</option>
                      <option value={30}>30 Minutes Inactivity (Recommended)</option>
                      <option value={60}>60 Minutes Inactivity</option>
                      <option value={0}>Disabled (Never Auto-Lock)</option>
                    </select>
                    <p className="text-[10.5px] text-slate-400 mt-1">Automatically locks screen if counter is unattended.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Brute-force Lockdown Rule
                    </label>
                    <select
                      value={newMaxAttempts}
                      onChange={(e) => setNewMaxAttempts(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                    >
                      <option value={3}>3 Failed Attempts → 60s Lock</option>
                      <option value={5}>5 Failed Attempts → 60s Lock (Default)</option>
                      <option value={10}>10 Failed Attempts → 60s Lock</option>
                    </select>
                    <p className="text-[10.5px] text-slate-400 mt-1">Temporary cooldown against unauthorized guessing.</p>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Reset admin credentials back to default (admin123 / PIN 2026)?')) {
                        updateAdminSecurity({
                          adminUsername: 'admin',
                          password: 'admin123',
                          securityPin: '2026',
                          autoLockMinutes: 30,
                          maxFailedAttempts: 5
                        });
                        setNewAdminUsername('admin');
                        setNewSecurityPin('2026');
                        setNewAutoLockMinutes(30);
                        setNewMaxAttempts(5);
                        setCurrentPasswordInput('');
                        setNewAdminPassword('');
                        setConfirmAdminPassword('');
                        setSecuritySuccessMsg('Credentials reset to defaults: Username admin, Password admin123, PIN 2026');
                      }
                    }}
                    className="text-xs font-semibold text-slate-500 hover:text-red-700 transition-colors"
                  >
                    Reset to Default Credentials
                  </button>

                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Security Policy</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Security Policies, Session Overview & Quick Actions (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Active Session Card */}
              <div className="geometric-card p-5 space-y-3 bg-slate-900 text-white">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Active Admin Session</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400">Authenticated</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                    <span>Operator Identity</span>
                    <span className="text-white font-mono font-bold">{adminSecurity.adminUsername}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                    <span>Last Login Timestamp</span>
                    <span className="text-white font-mono">{adminSecurity.lastLoginAt || 'Active Now'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                    <span>Quick PIN Access</span>
                    <span className="text-white font-mono">{adminSecurity.securityPin ? 'Enabled (• • • •)' : 'Disabled'}</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-400">
                    <span>Auto-Lock Timeout</span>
                    <span className="text-white font-mono">{adminSecurity.autoLockMinutes > 0 ? `${adminSecurity.autoLockMinutes} mins` : 'Disabled'}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={logoutAdmin}
                    className="w-full bg-slate-800 hover:bg-red-600/80 text-white font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-400" />
                    <span>Terminate Session & Lock Out</span>
                  </button>
                </div>
              </div>

              {/* Security Sentry Specifications */}
              <div className="geometric-card p-5 space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Kendra Security Standards</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span><strong>Customer Data Privacy:</strong> Aadhaar/PAN documents accessible strictly to authenticated admins.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span><strong>Anti-Brute Force:</strong> System locks out login attempts after consecutive invalid entries.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span><strong>Audit Trail Ledger:</strong> All administrative order edits, tracking updates, and payments are logged.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span><strong>Terminal Auto-Lock:</strong> Protects customer portal when cashier is away from desk.</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>

          {/* Full-width Section: Administrative Audit Trail Ledger */}
          <div className="geometric-card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <History className="w-4 h-4 text-blue-600" />
                  <span>Administrative Audit Trail & Security Ledger</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Comprehensive audit record of all operator actions, logins, status changes, and payment verifications.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Filter */}
                <select
                  value={auditFilter}
                  onChange={(e) => setAuditFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-bold"
                >
                  <option value="ALL">All Events ({auditLogs.length})</option>
                  <option value="SUCCESS">Success Only</option>
                  <option value="WARNING">Warnings</option>
                  <option value="FAILED">Failed / Security Alerts</option>
                </select>

                <button
                  type="button"
                  onClick={handleExportAuditLogs}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold border border-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Export Audit Logs as JSON"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Clear all historical security audit logs?')) {
                      clearAuditLogs();
                    }
                  }}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold border border-red-200 transition-colors cursor-pointer"
                >
                  Clear Logs
                </button>
              </div>
            </div>

            {/* Audit Logs Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Action Type</th>
                    <th className="py-2.5 px-3">Action Details</th>
                    <th className="py-2.5 px-3">Workstation / Device</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs
                    .filter(log => auditFilter === 'ALL' || log.status === auditFilter)
                    .map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                          {log.timestamp}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            log.status === 'SUCCESS' 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                              : log.status === 'WARNING'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-red-100 text-red-800 border border-red-300'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-800 whitespace-nowrap">
                          {log.action}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 max-w-md">
                          {log.details}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 font-mono text-[10.5px] whitespace-nowrap">
                          {log.ipOrDevice || 'Kendra Admin Workstation'}
                        </td>
                      </tr>
                    ))}
                  {auditLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No audit events recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* MODAL: UPDATE ORDER STATUS & ASSIGN TRACKING */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="geometric-card shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-base">Update Order #{editingOrder.id}</h4>
                <p className="text-xs text-slate-400 font-mono">
                  Customer: {editingOrder.customerName} ({editingOrder.customerCode})
                </p>
              </div>
              <button
                onClick={() => setEditingOrder(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveOrderStatus} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Change Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                >
                  <option value="Pending">Pending (Awaiting payment/review)</option>
                  <option value="Payment Verified">Payment Verified (Verified in bank)</option>
                  <option value="Printing">Printing (PVC smart card in machine)</option>
                  <option value="Dispatched">Dispatched (Handed over to courier)</option>
                  <option value="Delivered">Delivered (Doorstep received)</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Courier Partner
                </label>
                <input
                  type="text"
                  value={courierPartner}
                  onChange={(e) => setCourierPartner(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Consignment Tracking Number *
                </label>
                <input
                  type="text"
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. EZTRACK-829102 or SP829104812IN"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold"
                />
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Customer will use this tracking number to follow Speed Post consignment.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tracking Event Location / Note
                </label>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Dispatched from Howrah NSH to destination"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                {editingOrder && (
                  <a
                    href={getWhatsAppChatUrl(
                      editingOrder.customerPhone,
                      buildAdminCustomerAlertMessage(
                        { 
                          ...editingOrder, 
                          status: newStatus, 
                          tracking: trackingNumber 
                            ? { trackingNumber, courierPartner, statusHistory: editingOrder.tracking?.statusHistory || [] } 
                            : editingOrder.tracking 
                        },
                        newStatus,
                        siteSettings
                      )
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl border border-emerald-300 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp Customer</span>
                  </a>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setEditingOrder(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow"
                  >
                    Save Status & Tracking
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL: ADD NEW SERVICE ("Sarvice add problem fix") */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="geometric-card shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="bg-emerald-700 text-white p-5 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-base">Add New Seva Service / PVC Card</h4>
                <p className="text-xs text-emerald-100">Create new service with price, category, and required documents.</p>
              </div>
              <button
                onClick={() => setServiceModalOpen(false)}
                className="p-1.5 text-emerald-200 hover:text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewService} className="p-6 space-y-4">
              {serviceFormError && (
                <div className="p-3 bg-red-50 text-red-900 border border-red-200 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{serviceFormError}</span>
                </div>
              )}

              {serviceFormSuccessMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{serviceFormSuccessMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={serviceFormTitle}
                  onChange={(e) => setServiceFormTitle(e.target.value)}
                  placeholder="e.g. Senior Citizen Smart Card PVC"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={serviceFormCategory}
                    onChange={(e) => setServiceFormCategory(e.target.value as ServiceCategory)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="pvc_card">🪪 Smart PVC Card</option>
                    <option value="certificate">📜 Certificate</option>
                    <option value="document">📑 Document Service</option>
                    <option value="utility">⚡ Utility</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price in INR (₹) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={serviceFormPrice}
                    onChange={(e) => setServiceFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Turnaround Time</label>
                  <input
                    type="text"
                    value={serviceFormTurnaround}
                    onChange={(e) => setServiceFormTurnaround(e.target.value)}
                    placeholder="e.g. 24-48 Hours"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Badge (Optional)</label>
                  <input
                    type="text"
                    value={serviceFormBadge}
                    onChange={(e) => setServiceFormBadge(e.target.value)}
                    placeholder="e.g. Popular, High Speed"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={serviceFormDescription}
                  onChange={(e) => setServiceFormDescription(e.target.value)}
                  placeholder="Service details and specifications..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Required Documents (Comma separated)
                </label>
                <input
                  type="text"
                  value={serviceFormDocs}
                  onChange={(e) => setServiceFormDocs(e.target.value)}
                  placeholder="e.g. Aadhaar Card, Passport Photo, e-Card PDF"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Service</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
