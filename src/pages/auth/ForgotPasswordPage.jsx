import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Mail,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { ROUTES } from '@/constants';
import { useToast } from '@/context';
import { apiClient } from '@/api';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const toast = useToast();

  // State management
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Reset Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Resend OTP Cooldown Timer state
  const [cooldown, setCooldown] = useState(0);

  // Handle countdown for resend cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Step 1: Request OTP
  async function handleSendOTP(event) {
    if (event) event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      if (response.success) {
        toast.success(response.message || 'OTP sent successfully to your email!');
        setStep(2);
        setCooldown(60); // Start 60s cooldown
      } else {
        const errorMsg = response.message || 'Failed to send OTP';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errMsg = err.message || 'Failed to request OTP. Please try again.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  }

  // Step 2: Reset Password
  async function handleResetPassword(event) {
    event.preventDefault();
    setError('');

    // Front-end Validations
    if (otp.length !== 6) {
      setError('OTP must be exactly 6 digits.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.post('/auth/reset-password', {
        email,
        otp,
        password,
        confirmPassword,
      });

      if (response.success) {
        toast.success(response.message || 'Password reset successfully!');
        navigate(ROUTES.SIGN_IN);
      } else {
        const errorMsg = response.message || 'Failed to reset password';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errMsg = err.message || 'Failed to reset password. Please verify your OTP and try again.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-900/10">
          <KeyRound className="h-8 w-8 text-slate-900" />
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight">
          {step === 1 ? 'Forgot Password?' : 'Reset Password'}
        </h1>
        <p className="text-lg text-gray-500">
          {step === 1
            ? 'No worries, we will send you verification instructions.'
            : 'Enter the verification code and set your new password.'}
        </p>
      </div>

      {/* Main Container */}
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm md:p-10">
        {error && (
          <p className="mb-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 animate-slide-down" role="alert">
            {error}
          </p>
        )}

        {step === 1 ? (
          /* STEP 1: Enter Email Form */
          <form className="space-y-5" onSubmit={handleSendOTP}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-gray-50 disabled:text-gray-400"
                  placeholder="Enter your registered email"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 text-base font-semibold text-white transition-colors hover:bg-slate-800 disabled:bg-slate-800/80 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : null}
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>

            <div className="text-center pt-2">
              <Link
                to={ROUTES.SIGN_IN}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-900 hover:underline"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Login
              </Link>
            </div>
          </form>
        ) : (
          /* STEP 2: Enter OTP & New Password Form */
          <form className="space-y-5" onSubmit={handleResetPassword}>
            {/* Show Target Email Indicator */}
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-sm text-gray-600 border border-gray-100">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span className="break-all">OTP sent to: <strong>{email}</strong></span>
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isLoading}
                className="ml-auto text-xs font-semibold text-slate-900 hover:underline shrink-0 disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
              >
                Edit
              </button>
            </div>

            {/* OTP Code */}
            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium">
                Verification Code (6-digit OTP) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Numeric only
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 tracking-widest font-semibold disabled:bg-gray-50 disabled:text-gray-400"
                  placeholder="------"
                  required
                />
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-10 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-gray-50 disabled:text-gray-400"
                  placeholder="Minimum 8 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-900"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-10 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-gray-50 disabled:text-gray-400"
                  placeholder="Re-enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-900"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Reset Password Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 text-base font-semibold text-white transition-colors hover:bg-slate-800 disabled:bg-slate-800/80 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : null}
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </button>

            {/* Resend OTP block */}
            <div className="flex items-center justify-between pt-2 text-sm">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 font-medium text-gray-500 hover:text-slate-900 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-4 w-4" /> Edit Email
              </button>

              <button
                type="button"
                disabled={cooldown > 0 || isLoading}
                onClick={() => handleSendOTP()}
                className="font-medium text-slate-900 hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
              >
                {cooldown > 0 ? `Resend OTP (${cooldown}s)` : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="mt-6 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <ShieldCheck className="h-4 w-4" />
          <p>Your information is protected with industry-standard encryption</p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
