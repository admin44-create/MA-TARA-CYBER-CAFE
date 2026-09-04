import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, ShieldAlert, X, ArrowRight, Key, Eye, EyeOff, ShieldCheck, Clock, Hash } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { 
    adminLoginModalOpen, 
    setAdminLoginModalOpen, 
    loginAdminWithCredentials, 
    adminLockoutRemainingSec,
    adminSecurity 
  } = useApp();

  const [authMode, setAuthMode] = useState<'password' | 'pin'>('password');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!adminLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (adminLockoutRemainingSec > 0) {
      setError(`Access locked. Please wait ${adminLockoutRemainingSec}s.`);
      return;
    }

    if (authMode === 'password') {
      const result = loginAdminWithCredentials({ username, password });
      if (!result.success) {
        setError(result.message);
      }
    } else {
      const result = loginAdminWithCredentials({ pin });
      if (!result.success) {
        setError(result.message);
      }
    }
  };

  const handleDemoPasswordLogin = () => {
    setUsername('admin');
    setPassword('admin123');
    loginAdminWithCredentials({ username: 'admin', password: 'admin123' });
  };

  const handleDemoPinLogin = () => {
    setPin('2026');
    loginAdminWithCredentials({ pin: '2026' });
  };

  const isLockedOut = adminLockoutRemainingSec > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="geometric-card shadow-2xl max-w-md w-full overflow-hidden p-0 border border-slate-700 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with Security Badge */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white p-6 relative text-center border-b border-slate-800">
          <button
            onClick={() => setAdminLoginModalOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-400/40 text-blue-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 text-[11px] font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Encrypted Kendra Admin Gateway</span>
          </div>

          <h3 className="text-xl font-black tracking-tight">Admin Security Access</h3>
          <p className="text-xs text-slate-400 mt-1">EzySeva Authorized Portal Administration Console</p>
        </div>

        {/* Lockout Warning */}
        {isLockedOut && (
          <div className="bg-red-500/15 border-b border-red-500/30 p-4 text-red-700 dark:text-red-300 flex items-center gap-3">
            <Clock className="w-5 h-5 text-red-500 shrink-0 animate-spin" />
            <div className="text-xs">
              <p className="font-bold text-red-800">Security Lockdown Active</p>
              <p className="text-red-700">Repeated invalid attempts detected. Access suspended for <span className="font-mono font-bold text-red-900">{adminLockoutRemainingSec}s</span>.</p>
            </div>
          </div>
        )}

        {/* Auth Mode Tabs: Password vs Quick PIN */}
        <div className="grid grid-cols-2 p-2 bg-slate-100 border-b border-slate-200 text-xs font-bold text-center">
          <button
            type="button"
            onClick={() => { setAuthMode('password'); setError(''); }}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'password'
                ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Master Password</span>
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('pin'); setError(''); }}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'pin'
                ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            <span>Quick Security PIN</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs flex items-start gap-2 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          {authMode === 'password' ? (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Admin Username / Operator ID
                </label>
                <input
                  type="text"
                  required
                  disabled={isLockedOut}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono disabled:opacity-50"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Master Password
                  </label>
                  <span className="text-[11px] text-slate-400">Default: admin123</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={isLockedOut}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono pr-10 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  4 or 6-Digit Admin Security PIN
                </label>
                <span className="text-[11px] text-slate-400">Default PIN: 2026</span>
              </div>
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                required
                disabled={isLockedOut}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • •"
                className="w-full px-3.5 py-3 text-center text-lg tracking-[0.5em] bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono disabled:opacity-50"
              />
              <p className="text-[11px] text-slate-500 mt-1.5 text-center">
                Quick numeric PIN for secure mobile or countertop terminal unlock.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLockedOut}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-extrabold py-2.5 rounded-xl shadow transition-colors text-xs flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            <span>Verify & Enter Admin Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo Logins */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
            <button
              type="button"
              onClick={handleDemoPasswordLogin}
              disabled={isLockedOut}
              className="text-[11px] font-bold text-slate-700 hover:text-blue-800 bg-slate-100 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg border border-slate-200 flex-1 transition-colors flex items-center justify-center gap-1.5"
            >
              <Key className="w-3 h-3 text-blue-600" />
              <span>Demo Password (admin123)</span>
            </button>
            <button
              type="button"
              onClick={handleDemoPinLogin}
              disabled={isLockedOut}
              className="text-[11px] font-bold text-slate-700 hover:text-blue-800 bg-slate-100 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg border border-slate-200 flex-1 transition-colors flex items-center justify-center gap-1.5"
            >
              <Hash className="w-3 h-3 text-blue-600" />
              <span>Demo PIN (2026)</span>
            </button>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[10.5px] text-slate-500 flex items-start gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <p>
              Activity is recorded in the Admin Audit Ledger. Brute-force protection locks the portal after 5 failed attempts.
            </p>
          </div>
        </form>

      </div>
    </div>
  );
};
