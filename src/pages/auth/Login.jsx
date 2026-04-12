import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPhone, FiLock, FiEye, FiEyeOff, FiMail, FiArrowLeft, FiArrowRight, FiCheck, FiAlertCircle,
} from 'react-icons/fi';

import { Button, Card, Eyebrow, Input } from '../../components/ui';
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

  const [mode, setMode] = useState('login'); // 'login' | 'reset'
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center shadow-[0_8px_16px_-8px_rgba(16,185,129,0.45)]">
              <span className="text-white text-lg font-bold font-display">{brandName.charAt(0)}</span>
            </div>
          )}
          <span className="text-lg font-display font-semibold text-ink-900">{brandName}</span>
        </div>
      </div>

      <Card variant="elevated" padding="lg" className="md:!p-10">
        <AnimatePresence mode="wait">
          {mode === 'login' ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.3 }}
            >
              <Eyebrow>Welcome back</Eyebrow>
              <h1 className="text-display-md font-display text-ink-900 mt-3 mb-2">
                Sign in to your desk.
              </h1>
              <p className="text-sm text-ink-500 mb-7">
                Enter the mobile number and password you set up with the team.
              </p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700"
                >
                  <FiAlertCircle className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
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
                        className="text-ink-400 hover:text-ink-700 transition-colors pointer-events-auto"
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
                      className="text-xs font-semibold text-teal-700 hover:text-teal-800 underline-offset-4 hover:underline transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  rightIcon={!loading ? <FiArrowRight /> : undefined}
                >
                  {loading ? 'Signing in…' : 'Sign in'}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-ink-100 text-center text-xs text-ink-400">
                Protected by bank-grade encryption. Sessions expire after inactivity.
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
              <Eyebrow>Password reset</Eyebrow>
              <h1 className="text-display-md font-display text-ink-900 mt-3 mb-6">
                Check your inbox.
              </h1>

              {resetLoading ? (
                <div className="text-center py-10">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
                    <FiMail className="text-xl animate-pulse" />
                  </div>
                  <p className="text-sm text-ink-500">Sending reset link…</p>
                </div>
              ) : resetResult ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
                    <FiCheck className="text-2xl" strokeWidth={3} />
                  </div>
                  <p className="text-sm text-ink-700 mb-6">
                    Reset link sent to{' '}
                    <strong className="text-ink-900">{resetResult.maskedEmail}</strong>. Check your inbox.
                  </p>
                  <Button variant="primary" fullWidth onClick={goBackToLogin} leftIcon={<FiArrowLeft />}>
                    Back to sign in
                  </Button>
                </div>
              ) : (
                <>
                  {resetError && (
                    <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
                      <FiAlertCircle className="shrink-0 mt-0.5" />
                      <span>{resetError}</span>
                    </div>
                  )}
                  <Button variant="secondary" fullWidth onClick={goBackToLogin} leftIcon={<FiArrowLeft />}>
                    Back to sign in
                  </Button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default Login;
