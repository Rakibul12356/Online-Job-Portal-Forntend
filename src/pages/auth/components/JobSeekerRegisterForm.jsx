import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Briefcase,
  Calendar,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
  UserPlus,
} from 'lucide-react';
import { ROUTES } from '@/constants';

const inputClass =
  'w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900';

export function JobSeekerRegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm md:p-10">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              id="name"
              name="name"
              className={inputClass}
              placeholder="John"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
                className={inputClass}
                placeholder="john.doe@example.com"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="tel"
                id="phone"
                name="phone"
                className={inputClass}
                placeholder="+1 (555) 000-0000"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-1">
            <label htmlFor="experience" className="text-sm font-medium">
              Years of Experience
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <select
                id="experience"
                name="experience"
                className={`${inputClass} appearance-none bg-white`}
              >
                <option value="">Select experience level</option>
                <option value="entry">Entry Level (0-2 years)</option>
                <option value="mid">Mid Level (3-5 years)</option>
                <option value="senior">Senior (6-10 years)</option>
                <option value="expert">Expert (10+ years)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
                className={`${inputClass} pr-10`}
                placeholder="Create a strong password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                className={`${inputClass} pr-10`}
                placeholder="Re-enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
        <p className="-mt-2 text-xs text-gray-500">
          Password must be at least 8 characters with letters and numbers
        </p>

        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="terms"
            name="terms"
            className="mt-1 h-4 w-4 rounded border-gray-300"
            required
          />
          <label htmlFor="terms" className="text-sm text-gray-500">
            I agree to the{' '}
            <a href="#" className="text-slate-900 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-slate-900 hover:underline">
              Privacy Policy
            </a>
          </label>
        </div>

        <button
          type="submit"
          className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 text-base font-semibold text-white transition-colors hover:bg-slate-800"
        >
          <UserPlus className="h-4 w-4" />
          Create Account
        </button>
      </form>

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
        Already have an account?{' '}
        <Link
          to={ROUTES.SIGN_IN}
          className="font-medium text-slate-900 hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}

export function JobSeekerHighlights() {
  const highlights = [
    {
      icon: Briefcase,
      title: 'Thousands of Jobs',
      description: 'Access opportunities from top companies worldwide',
    },
    {
      icon: Bell,
      title: 'Job Alerts',
      description: 'Get notified when new jobs match your profile',
    },
    {
      icon: ShieldCheck,
      title: 'Secure & Private',
      description: 'Your data is protected with industry-standard security',
    },
  ];

  return (
    <>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {highlights.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="flex items-start gap-3 rounded-lg bg-gray-50/80 p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900/10">
              <Icon className="h-5 w-5 text-slate-900" />
            </div>
            <div>
              <h3 className="mb-1 text-sm font-semibold">{title}</h3>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          By creating an account, you&apos;ll get access to thousands of job
          opportunities from top companies worldwide.
        </p>
      </div>
    </>
  );
}

export default JobSeekerRegisterForm;
