import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Mail,
  ShieldCheck,
  User,
} from 'lucide-react';
import { DUMMY_ACCOUNTS, ROUTES } from '@/constants';
import { useAuth } from '@/context';

export function SignInPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [accountType, setAccountType] = useState('user');

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const result = login(email, password);
    if (result.success) {
      navigate(ROUTES.DASHBOARD);
      return;
    }

    setError(result.message);
  }

  function fillDummyCredentials(type) {
    const account = DUMMY_ACCOUNTS[type];
    setAccountType(type);
    setEmail(account.email);
    setPassword(account.password);
    setError('');
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-900/10">
          <LogIn className="h-8 w-8 text-slate-900" />
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight">
          Welcome Back
        </h1>
        <p className="text-lg text-gray-500">Sign in to access your account</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm md:p-10">
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => fillDummyCredentials('user')}
              className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${
                accountType === 'user'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <User className="h-4 w-4" />
              User
            </button>
            <button
              type="button"
              onClick={() => fillDummyCredentials('company')}
              className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${
                accountType === 'company'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Building2 className="h-4 w-4" />
              Company
            </button>
          </div>

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
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-10 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-900"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 text-base font-semibold text-white transition-colors hover:bg-slate-800"
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-400">
          Demo User: {DUMMY_ACCOUNTS.user.email} / {DUMMY_ACCOUNTS.user.password}
          <br />
          Demo Company: {DUMMY_ACCOUNTS.company.email} /{' '}
          {DUMMY_ACCOUNTS.company.password}
        </p>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 font-medium text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link
            to={ROUTES.REGISTER}
            className="font-medium text-slate-900 hover:underline"
          >
            Sign up as Job Seeker
          </Link>
        </div>
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

export default SignInPage;
