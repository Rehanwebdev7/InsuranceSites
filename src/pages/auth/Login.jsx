import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPhone, FiLock, FiEye, FiEyeOff, FiMail, FiArrowLeft, FiArrowRight, FiCheck, FiAlertCircle,
} from 'react-icons/fi';

import { Input } from '../../components/ui';
import { useAuth } from '../../contexts/AuthRuntimeContext';
import { useSettings } from '../../contexts/SettingsContext';

const Login = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const { login, resetPassword } = useAuth();
  const brandName = settings?.brandName || 'Bharat Insurance';

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState('login');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetResult, setResetResult] = useState(null);
  const [resetError, setResetError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(mobile, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid mobile number or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!mobile || mobile.length !== 10) {
      setError('Please enter your 10-digit mobile number first.');
      return;
    }
    setError('');
    setResetError('');
    setResetResult(null);
    setResetLoading(true);
    setMode('reset');
    try {
      const result = await resetPassword(mobile);
      setResetResult(result);
    } catch (err) {
      setResetError(err.message || 'Failed to send reset email.');
    } finally {
      setResetLoading(false);
    }
  };

  const goBackToLogin = () => {
    setMode('login');
    setResetResult(null);
    setResetError('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-md"
    >
      {/* Mobile brand lockup */}
      <div className="lg:hidden text-center mb-8">
        <div className="inline-flex items-center gap-2.5 mb-3">
          {settings?.brandFavicon ? (
            <img
              src={settings.brandFavicon}
              alt={brandName}
              referrerPolicy="no-referrer"
              className="w-10 h-10 object-contain"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A961] to-[#8B6F2C] flex items-center justify-center shadow-[0_8px_16px_-8px_rgba(201,169,97,0.55)] border border-[#E5C770]">
              <span className="text-noir-950 text-lg font-bold font-display italic">
                {brandName.charAt(0)}
              </span>
            </div>
          )}
          <span className="text-lg font-display font-semibold text-white tracking-tight">{brandName}</span>
        </div>
      </div>

      {/* Card — dark cabinet with gold rim */}
      <div className="relative rounded-3xl bg-noir-900 border border-[rgba(201,169,97,0.28)] shadow-[0_36px_72px_-24px_rgba(0,0,0,0.7)] p-7 md:p-10 overflow-hidden">
        {/* Soft warm halo inside card */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at top right, rgba(201,169,97,0.12) 0%, transparent 60%)',
          }}
        />
        {/* Gold corner accents */}
        <div aria-hidden className="absolute top-3 left-3 w-10 h-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-[2px] h-7 bg-[#C9A961]" />
          <div className="absolute top-0 left-0 h-[2px] w-7 bg-[#C9A961]" />
        </div>
        <div aria-hidden className="absolute bottom-3 right-3 w-10 h-10 pointer-events-none">
          <div className="absolute bottom-0 right-0 w-[2px] h-7 bg-[#C9A961]" />
          <div className="absolute bottom-0 right-0 h-[2px] w-7 bg-[#C9A961]" />
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.3 }}
              >
                {/* Eyebrow */}
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="font-display italic text-[0.7rem] font-semibold text-[#C9A961] tracking-widest">
                    Nº 01
                  </span>
                  <span className="w-8 h-px bg-[#C9A961]" />
                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#E5C770]">
                    Welcome back
                  </span>
                </div>

                <h1
                  className="font-display font-semibold text-white tracking-tight mb-2"
                  style={{ fontSize: 'clamp(1.625rem, 3.4vw, 2rem)', lineHeight: 1.1 }}
                >
                  Sign in to your{' '}
                  <span className="font-script italic" style={{ color: '#E5C770', fontSize: '1.1em' }}>
                    desk.
                  </span>
                </h1>
                <p className="text-sm text-ink-400 mb-6 leading-relaxed">
                  Enter the mobile number and password set up with your team.
                </p>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-300"
                  >
                    <FiAlertCircle className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input
                    tone="dark"
                    label="Mobile number"
                    type="tel"
                    leftIcon={<FiPhone />}
                    prefix="+91"
                    placeholder="10-digit mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                    required
                  />
                  <div>
                    <Input
                      tone="dark"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      leftIcon={<FiLock />}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          className="text-[#E5C770] hover:text-white transition-colors pointer-events-auto"
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      }
                      required
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs font-semibold text-[#E5C770] hover:text-white underline-offset-4 hover:underline transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    data-magnetic
                    className="group inline-flex items-center justify-center gap-2 w-full h-12 rounded-full bg-gradient-to-br from-[#C9A961] to-[#D4AF37] text-noir-950 font-semibold text-[0.9375rem] tracking-wide border border-[#B8923A] shadow-[0_18px_36px_-12px_rgba(201,169,97,0.55)] hover:shadow-[0_28px_56px_-16px_rgba(201,169,97,0.65)] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-noir-950 border-t-transparent rounded-full animate-spin" />
                        Signing in…
                      </>
                    ) : (
                      <>
                        Sign in
                        <FiArrowRight className="shrink-0 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </form>

                {/* Footer */}
                <div className="mt-7 pt-5 border-t border-[rgba(201,169,97,0.20)] text-center">
                  <div className="flex items-center justify-center gap-2 text-[0.7rem] text-ink-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse-slow" />
                    Bank-grade encryption · sessions expire after inactivity
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="reset"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="font-display italic text-[0.7rem] font-semibold text-[#C9A961] tracking-widest">
                    Nº 02
                  </span>
                  <span className="w-8 h-px bg-[#C9A961]" />
                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#E5C770]">
                    Password reset
                  </span>
                </div>
                <h1
                  className="font-display font-semibold text-white tracking-tight mb-6"
                  style={{ fontSize: 'clamp(1.625rem, 3.4vw, 2rem)', lineHeight: 1.1 }}
                >
                  Check your{' '}
                  <span className="font-script italic" style={{ color: '#E5C770', fontSize: '1.1em' }}>
                    inbox.
                  </span>
                </h1>

                {resetLoading ? (
                  <div className="text-center py-10">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-noir-800 border border-[rgba(201,169,97,0.30)] text-[#E5C770] flex items-center justify-center">
                      <FiMail className="text-xl animate-pulse" />
                    </div>
                    <p className="text-sm text-ink-400">Sending reset link…</p>
                  </div>
                ) : resetResult ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#C9A961] to-[#8B6F2C] text-noir-950 border border-[#E5C770] flex items-center justify-center shadow-[0_12px_24px_-8px_rgba(201,169,97,0.55)]">
                      <FiCheck className="text-2xl" strokeWidth={3} />
                    </div>
                    <p className="text-sm text-ink-300 mb-6 leading-relaxed">
                      Reset link sent to{' '}
                      <strong className="text-[#E5C770] font-semibold">{resetResult.maskedEmail}</strong>.
                      Check your inbox.
                    </p>
                    <button
                      onClick={goBackToLogin}
                      className="inline-flex items-center justify-center gap-2 w-full h-12 rounded-full bg-gradient-to-br from-[#C9A961] to-[#D4AF37] text-noir-950 font-semibold text-[0.9375rem] tracking-wide border border-[#B8923A] shadow-[0_18px_36px_-12px_rgba(201,169,97,0.55)] hover:shadow-[0_28px_56px_-16px_rgba(201,169,97,0.65)] active:scale-[0.98] transition-all duration-300 whitespace-nowrap"
                    >
                      <FiArrowLeft />
                      Back to sign in
                    </button>
                  </div>
                ) : (
                  <>
                    {resetError && (
                      <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-300">
                        <FiAlertCircle className="shrink-0 mt-0.5" />
                        <span>{resetError}</span>
                      </div>
                    )}
                    <button
                      onClick={goBackToLogin}
                      className="inline-flex items-center justify-center gap-2 w-full h-12 rounded-full bg-noir-800 text-[#E5C770] border border-[#C9A961] font-semibold text-[0.9375rem] hover:bg-noir-700 hover:text-white transition-all duration-300 whitespace-nowrap"
                    >
                      <FiArrowLeft />
                      Back to sign in
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
