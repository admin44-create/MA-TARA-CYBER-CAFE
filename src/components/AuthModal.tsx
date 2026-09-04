import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_INDIAN_STATES, getDistrictsForState } from '../data/indiaLocations';
import { 
  X, 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin, 
  Lock, 
  User, 
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Shield,
  KeyRound,
  RotateCw,
  Eye,
  EyeOff,
  Copy,
  Check,
  Send,
  CheckCheck,
  HelpCircle
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    authModalTab, 
    setAuthModalTab, 
    loginCustomer, 
    registerCustomer, 
    resetCustomerPassword,
    sendPasswordResetOtp,
    loginDemoCustomer,
    selectedServiceForOrder,
    setOrderModalOpen,
    setCurrentView,
    siteSettings
  } = useApp();

  // Login form state
  const [loginInput, setLoginInput] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regStep, setRegStep] = useState<'form' | 'otp_verify' | 'credentials_dispatched'>('form');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedState, setSelectedState] = useState('West Bengal');
  const [selectedDistrict, setSelectedDistrict] = useState('North 24 Parganas');
  const [pinCode, setPinCode] = useState('');
  const [address, setAddress] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [registerMessage, setRegisterMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Dispatched credentials preview modal state
  const [dispatchedCredentials, setDispatchedCredentials] = useState<{
    customerCode: string;
    fullName: string;
    email: string;
    phone: string;
    passwordUsed: string;
    dispatchedAt: string;
  } | null>(null);
  const [copiedCreds, setCopiedCreds] = useState(false);
  const [showDispatchedPassword, setShowDispatchedPassword] = useState(false);

  // OTP state for registration
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(30);
  const [otpNotification, setOtpNotification] = useState<string | null>(null);
  const [otpError, setOtpError] = useState('');

  // Forgot Password state
  const [forgotStep, setForgotStep] = useState<'request' | 'verify_and_reset'>('request');
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotOtpEntered, setForgotOtpEntered] = useState('');
  const [forgotGeneratedOtp, setForgotGeneratedOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotRecipientInfo, setForgotRecipientInfo] = useState<{ email: string; phone: string; name: string; customerCode?: string } | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (regStep === 'otp_verify' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [regStep, otpTimer]);

  if (!authModalOpen) return null;

  const districts = getDistrictsForState(selectedState);

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const newDistricts = getDistrictsForState(stateName);
    setSelectedDistrict(newDistricts[0] || '');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginInput.trim()) {
      setLoginError('Please enter your Phone, Email, or Customer ID.');
      return;
    }

    const result = loginCustomer(loginInput, loginPassword);
    if (!result.success) {
      setLoginError(result.message);
    } else {
      if (selectedServiceForOrder) {
        setOrderModalOpen(true);
      }
    }
  };

  // Step 1: Send OTP to Mobile Number
  const handleInitiateRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterMessage(null);
    setOtpError('');

    if (!fullName.trim() || !phone.trim() || !email.trim() || !pinCode.trim() || !address.trim() || !regPassword.trim()) {
      setRegisterMessage({ text: 'Please fill out all required fields, including password.', type: 'error' });
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setRegisterMessage({ text: 'Please enter a valid 10-digit mobile number.', type: 'error' });
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setRegisterMessage({ text: 'Please enter a valid Gmail / Email address for credentials delivery.', type: 'error' });
      return;
    }

    if (regPassword.length < 6) {
      setRegisterMessage({ text: 'Password must be at least 6 characters long for security.', type: 'error' });
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegisterMessage({ text: 'Passwords do not match! Please check and confirm.', type: 'error' });
      return;
    }

    // Generate real 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setEnteredOtp('');
    setOtpTimer(30);
    setRegStep('otp_verify');
    setOtpNotification(`📲 SMS Gateway: Your verification OTP is ${code}. Valid for 10 minutes.`);
  };

  const handleResendOtp = () => {
    if (otpTimer > 0) return;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setEnteredOtp('');
    setOtpTimer(30);
    setOtpError('');
    setOtpNotification(`📲 New SMS Sent: Your verification OTP is ${code}. Valid for 10 minutes.`);
  };

  // Step 2: Verify OTP and create Customer account
  const handleVerifyOtpAndRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');

    if (enteredOtp.trim() !== generatedOtp.trim()) {
      setOtpError('Invalid OTP code. Please enter the 6-digit code received on your mobile.');
      return;
    }

    const result = registerCustomer({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      state: selectedState,
      district: selectedDistrict,
      pinCode: pinCode.trim(),
      address: address.trim(),
      password: regPassword.trim()
    });

    if (!result.success) {
      setOtpError(result.message);
    } else if (result.customer) {
      setDispatchedCredentials({
        customerCode: result.customer.customerCode,
        fullName: result.customer.fullName,
        email: result.customer.email,
        phone: result.customer.phone,
        passwordUsed: regPassword.trim(),
        dispatchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setRegStep('credentials_dispatched');
    }
  };

  const handleCopyCredentials = () => {
    if (!dispatchedCredentials) return;
    const credText = `MA TARA CYBER CAFE Credentials:\nCustomer ID: ${dispatchedCredentials.customerCode}\nPassword: ${dispatchedCredentials.passwordUsed}\nRegistered Gmail: ${dispatchedCredentials.email}\nPhone: +91 ${dispatchedCredentials.phone}\nKeep safe for tracking orders & GST invoices.`;
    navigator.clipboard.writeText(credText);
    setCopiedCreds(true);
    setTimeout(() => setCopiedCreds(false), 3000);
  };

  // Forgot Password Handlers
  const handleRequestPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!forgotIdentifier.trim()) {
      setForgotError('Please enter your registered Email, Mobile, or Customer ID.');
      return;
    }

    const res = sendPasswordResetOtp(forgotIdentifier.trim());
    if (!res.success) {
      setForgotError(res.message);
    } else {
      setForgotGeneratedOtp(res.otp || '');
      setForgotRecipientInfo({
        email: res.email || '',
        phone: res.phone || '',
        name: res.customerName || 'Customer',
        customerCode: res.customerCode
      });
      setForgotStep('verify_and_reset');
      setForgotSuccess(`Security verification code sent to Gmail: ${res.email} and SMS: +91 ${res.phone}`);
    }
  };

  const handleVerifyAndResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (forgotOtpEntered.trim() !== forgotGeneratedOtp.trim()) {
      setForgotError('Invalid verification code. Please enter the 6-digit code received.');
      return;
    }

    if (forgotNewPassword.length < 6) {
      setForgotError('New password must be at least 6 characters long.');
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('New passwords do not match! Please confirm carefully.');
      return;
    }

    const res = resetCustomerPassword(forgotIdentifier.trim(), forgotNewPassword.trim());
    if (!res.success) {
      setForgotError(res.message);
    } else {
      setForgotSuccess('Password updated successfully! Logging you into your customer portal...');
      setTimeout(() => {
        setAuthModalOpen(false);
        setAuthModalTab('login');
        setCurrentView('customer_portal');
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="geometric-card shadow-2xl max-w-lg w-full overflow-hidden p-0 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="bg-slate-950 text-white p-6 relative border-b border-slate-800">
          <button
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
              {siteSettings.siteName}
            </span>
            <span className="text-slate-300 text-xs flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-blue-400" /> Secure Customer Gateway
            </span>
          </div>

          <h3 className="text-2xl font-black tracking-tight">
            {authModalTab === 'register' 
              ? 'Create Customer ID & Password' 
              : authModalTab === 'forgot_password' 
                ? 'Reset Customer Password'
                : 'Customer Account Sign In'}
          </h3>
          <p className="text-slate-300 text-xs mt-1">
            {authModalTab === 'register' 
              ? 'Required for online Seva orders, speed post tracking, and GST invoices. Credentials sent to your Gmail.' 
              : authModalTab === 'forgot_password'
                ? 'Recover your account password using your registered Gmail or mobile number.'
                : 'Sign in with your Customer ID, Mobile Number, or registered Email.'}
          </p>

          {/* Tab Switcher */}
          <div className="flex bg-slate-900 p-1 rounded-xl mt-4 border border-slate-800">
            <button
              onClick={() => { 
                setAuthModalTab('register'); 
                setRegStep('form');
                setLoginError(''); 
              }}
              className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authModalTab === 'register' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Register & Get Password</span>
            </button>
            <button
              onClick={() => { 
                setAuthModalTab('login'); 
                setRegisterMessage(null); 
              }}
              className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                authModalTab === 'login' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Customer Login
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {/* TAB 1: REGISTRATION */}
          {authModalTab === 'register' && (
            <div>
              {/* SUBSTEP 1: REGISTRATION FORM */}
              {regStep === 'form' && (
                <form onSubmit={handleInitiateRegistration} className="space-y-4">
                  {registerMessage && (
                    <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                      registerMessage.type === 'success' 
                        ? 'bg-blue-50 text-blue-900 border border-blue-200 font-medium' 
                        : 'bg-red-50 text-red-900 border border-red-200 font-bold'
                    }`}>
                      {registerMessage.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      )}
                      <span>{registerMessage.text}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Sourav Das"
                          className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                        />
                        <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Mobile Number (10 Digits) *
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="9876543210"
                          className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                        />
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Gmail / Email Address (Credentials will be sent here) *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  {/* SECURITY: Password & Confirm Password Section */}
                  <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-[11px] font-bold text-slate-900">Set Account Password</span>
                      </div>
                      <span className="text-[10px] text-blue-700 font-bold bg-blue-100 px-2 py-0.5 rounded-md">
                        ID & Password will go to Gmail
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Create Password (Min 6 Chars) *
                        </label>
                        <div className="relative">
                          <input
                            type={showRegPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="Enter secure password"
                            className="w-full pl-8 pr-8 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                          />
                          <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                          <button
                            type="button"
                            onClick={() => setShowRegPassword(!showRegPassword)}
                            className="text-slate-400 hover:text-slate-700 absolute right-2.5 top-2.5 cursor-pointer"
                          >
                            {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Confirm Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showRegPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            value={regConfirmPassword}
                            onChange={(e) => setRegConfirmPassword(e.target.value)}
                            placeholder="Confirm password"
                            className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                          />
                          <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* State & District Selectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Select State / UT *
                      </label>
                      <select
                        value={selectedState}
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
                        Select District *
                      </label>
                      <select
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                      >
                        {districts.map((dst) => (
                          <option key={dst} value={dst}>{dst}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Address & PIN Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Delivery Street Address / Village *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="House No, Ward, Village / Post Office"
                          className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                        />
                        <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                        placeholder="700001"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all cursor-pointer"
                  >
                    <span>Send SMS OTP & Verify Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* SUBSTEP 2: OTP VERIFICATION */}
              {regStep === 'otp_verify' && (
                <form onSubmit={handleVerifyOtpAndRegister} className="space-y-4">
                  {/* Simulated SMS banner with 1-click Auto-fill */}
                  {otpNotification && (
                    <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 space-y-2">
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1.5">
                          <Send className="w-3.5 h-3.5 text-blue-600" />
                          <span>Official SMS Gateway</span>
                        </span>
                        <span className="text-[10px] text-blue-600">Delivered</span>
                      </div>
                      <p className="font-mono text-slate-700">{otpNotification}</p>
                      <button
                        type="button"
                        onClick={() => setEnteredOtp(generatedOtp)}
                        className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        ⚡ Click here to 1-Click Auto-Fill Code ({generatedOtp})
                      </button>
                    </div>
                  )}

                  {otpError && (
                    <div className="p-3 bg-red-50 text-red-900 border border-red-200 rounded-xl text-xs flex items-center gap-2 font-bold">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{otpError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-center">
                      Enter 6-Digit Mobile Verification Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      autoFocus
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full text-center tracking-[0.4em] font-mono text-2xl font-bold py-3 bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <button
                      type="button"
                      onClick={() => setRegStep('form')}
                      className="text-blue-600 hover:underline font-semibold cursor-pointer"
                    >
                      ← Edit Registration Details
                    </button>

                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={otpTimer > 0}
                      className="text-blue-600 hover:underline disabled:opacity-40 disabled:no-underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>{otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend SMS OTP'}</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify OTP & Dispatch to Gmail</span>
                  </button>
                </form>
              )}

              {/* SUBSTEP 3: CREDENTIALS DISPATCHED TO GMAIL (USER'S EXPLICIT REQUIREMENT) */}
              {regStep === 'credentials_dispatched' && dispatchedCredentials && (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                      <CheckCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-emerald-950">
                        Registration Successful!
                      </h4>
                      <p className="text-xs text-emerald-800 mt-0.5">
                        Your Customer ID and Password have been generated and dispatched to your Gmail.
                      </p>
                    </div>
                  </div>

                  {/* Gmail Confirmation Box */}
                  <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3 border border-slate-800 shadow-md">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-blue-400" />
                        <span>Dispatched to Registered Gmail:</span>
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {dispatchedCredentials.email}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Your Customer ID</span>
                        <span className="text-sm font-black text-amber-300 font-mono">
                          {dispatchedCredentials.customerCode}
                        </span>
                      </div>

                      <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Password</span>
                          <button
                            type="button"
                            onClick={() => setShowDispatchedPassword(!showDispatchedPassword)}
                            className="text-slate-400 hover:text-white"
                          >
                            {showDispatchedPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                        </div>
                        <span className="text-sm font-black text-blue-300 font-mono">
                          {showDispatchedPassword ? dispatchedCredentials.passwordUsed : '••••••••'}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-300 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                      <p className="font-semibold text-slate-200">📬 Simulated Gmail Inbox Notification:</p>
                      <p className="mt-1 text-slate-400 leading-relaxed font-sans">
                        From: <span className="text-slate-200 font-bold">{siteSettings.siteName}</span> &lt;support@{siteSettings.siteName.toLowerCase().replace(/[^a-z0-9]/g, '')}.in&gt;<br />
                        Subject: Welcome! Your Customer ID is {dispatchedCredentials.customerCode}<br />
                        Body: Hello {dispatchedCredentials.fullName}, your account is active. Use ID: {dispatchedCredentials.customerCode} and your chosen password to log in and track speed post consignments anytime.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleCopyCredentials}
                      className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedCreds ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                      <span>{copiedCreds ? 'Copied to Clipboard!' : 'Copy ID & Password'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAuthModalOpen(false);
                        if (selectedServiceForOrder) {
                          setOrderModalOpen(true);
                        } else {
                          setCurrentView('customer_portal');
                        }
                      }}
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Proceed to Portal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CUSTOMER LOGIN */}
          {authModalTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 text-red-900 border border-red-200 rounded-xl text-xs flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enter Mobile Number, Email, or Customer ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    placeholder="e.g. 9876501234 or EZ-829104"
                    className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Account Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalTab('forgot_password');
                      setForgotStep('request');
                      setForgotError('');
                      setForgotSuccess('');
                      setForgotIdentifier(loginInput);
                    }}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    Forgot Password? / পাসওয়ার্ড ভুলে গেছেন?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full pl-9 pr-9 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="text-slate-400 hover:text-slate-700 absolute right-3 top-2.5 cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold py-3 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <span>Login to Customer Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Fast 1-Click Demo Customer Logins */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Instant Demo Customer Login (Click to Sign In):
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => loginDemoCustomer('EZ-829104')}
                    className="stat-box p-3 text-left hover:border-blue-300 transition-all cursor-pointer"
                  >
                    <div className="font-bold text-slate-900 text-xs">Rahul Sharma</div>
                    <div className="text-[10px] text-blue-700 font-mono">ID: EZ-829104 (Dispatched)</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => loginDemoCustomer('EZ-640192')}
                    className="stat-box p-3 text-left hover:border-blue-300 transition-all cursor-pointer"
                  >
                    <div className="font-bold text-slate-900 text-xs">Priya Mukherjee</div>
                    <div className="text-[10px] text-blue-700 font-mono">ID: EZ-640192 (Printing)</div>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 3: FORGOT PASSWORD RECOVERY (USER'S EXPLICIT REQUIREMENT: "password vule gele forget korte parbe") */}
          {authModalTab === 'forgot_password' && (
            <div className="space-y-4">
              {forgotError && (
                <div className="p-3 bg-red-50 text-red-900 border border-red-200 rounded-xl text-xs flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{forgotError}</span>
                </div>
              )}

              {forgotSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{forgotSuccess}</span>
                </div>
              )}

              {/* STEP 1: Enter Registered Email or Mobile */}
              {forgotStep === 'request' && (
                <form onSubmit={handleRequestPasswordReset} className="space-y-4">
                  <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-slate-700 leading-relaxed">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                      <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                      <span>Password Recovery Verification</span>
                    </p>
                    Enter your registered Gmail, mobile number, or Customer ID. We will generate and send a 6-digit security code to your email and SMS.
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Registered Gmail, Mobile, or Customer ID *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={forgotIdentifier}
                        onChange={(e) => setForgotIdentifier(e.target.value)}
                        placeholder="e.g. rahul.sharma@gmail.com or 9876501234 or EZ-829104"
                        className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setAuthModalTab('login')}
                      className="text-slate-600 hover:text-slate-900 font-bold hover:underline cursor-pointer"
                    >
                      ← Back to Login
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold py-3 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    <span>Send Reset OTP to Gmail & Mobile</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* STEP 2: Verify Code and Set New Password */}
              {forgotStep === 'verify_and_reset' && (
                <form onSubmit={handleVerifyAndResetPassword} className="space-y-4">
                  {/* Simulated Incoming Security Code Alert with 1-click Auto-fill */}
                  <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-blue-900">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                        <span>Security Code Sent</span>
                      </span>
                      <span className="text-[10px] text-blue-600">Gmail: {forgotRecipientInfo?.email}</span>
                    </div>
                    <p className="text-slate-700 font-mono">
                      Your 6-digit password reset verification code is: <span className="font-bold text-blue-700">{forgotGeneratedOtp}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setForgotOtpEntered(forgotGeneratedOtp)}
                      className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      ⚡ 1-Click Auto-Fill Code ({forgotGeneratedOtp})
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-center">
                      Enter 6-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      autoFocus
                      value={forgotOtpEntered}
                      onChange={(e) => setForgotOtpEntered(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full text-center tracking-[0.4em] font-mono text-2xl font-bold py-2.5 bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-3 pt-1">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700">
                          Create New Password *
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                          className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                        >
                          {showForgotNewPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span>{showForgotNewPassword ? 'Hide' : 'Show'}</span>
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showForgotNewPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          value={forgotNewPassword}
                          onChange={(e) => setForgotNewPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                        />
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Confirm New Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showForgotNewPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          value={forgotConfirmPassword}
                          onChange={(e) => setForgotConfirmPassword(e.target.value)}
                          placeholder="Re-type new password"
                          className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                        />
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setForgotStep('request')}
                      className="text-blue-600 hover:underline font-semibold cursor-pointer"
                    >
                      ← Change Email / Phone
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Reset Password & Log In Now</span>
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
