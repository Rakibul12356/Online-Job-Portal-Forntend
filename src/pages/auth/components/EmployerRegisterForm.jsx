import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Building,
  Building2,
  Calendar,
  ChartLine,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Mail,
  MapPin,
  Shield,
  Users,
  Zap,
} from 'lucide-react';
import { ROUTES } from '@/constants';

const inputClass =
  'w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900';

export function EmployerRegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm md:p-10">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <Building className="h-5 w-5 text-slate-900" />
            <h2 className="text-lg font-semibold">Company Information</h2>
          </div>

          <div className="space-y-2">
            <label htmlFor="companyName" className="text-sm font-medium">
              Company Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                id="companyName"
                name="companyName"
                className={inputClass}
                placeholder="e.g., TechCorp Solutions"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="employerEmail" className="text-sm font-medium">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                id="employerEmail"
                name="email"
                className={inputClass}
                placeholder="john.doe@company.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="website" className="text-sm font-medium">
                Company Website <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="url"
                  id="website"
                  name="website"
                  className={inputClass}
                  placeholder="https://example.com"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="industry" className="text-sm font-medium">
                Industry <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <select
                  id="industry"
                  name="industry"
                  className={`${inputClass} appearance-none bg-white`}
                  required
                >
                  <option value="">Select industry</option>
                  <option value="technology">Technology</option>
                  <option value="finance">Finance & Banking</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="retail">Retail & E-commerce</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="consulting">Consulting</option>
                  <option value="marketing">Marketing & Advertising</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="companySize" className="text-sm font-medium">
                Company Size
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <select
                  id="companySize"
                  name="companySize"
                  className={`${inputClass} appearance-none bg-white`}
                >
                  <option value="">Select company size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="foundedYear" className="text-sm font-medium">
                Founded Year
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="number"
                  id="foundedYear"
                  name="foundedYear"
                  className={inputClass}
                  placeholder="e.g., 2010"
                  min="1800"
                  max="2025"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Headquarters Location <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                id="location"
                name="location"
                className={inputClass}
                placeholder="City, Country"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Company Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              className="min-h-[120px] w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              placeholder="Tell us about your company, mission, and what makes it a great place to work..."
              required
            />
            <p className="text-xs text-gray-500">
              Minimum 100 characters. This will be displayed on your company
              profile.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <Shield className="h-5 w-5 text-slate-900" />
            <h2 className="text-lg font-semibold">Account Security</h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="employerPassword" className="text-sm font-medium">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="employerPassword"
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
              <label
                htmlFor="employerConfirmPassword"
                className="text-sm font-medium"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="employerConfirmPassword"
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
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="employerTerms"
              name="terms"
              className="mt-1 h-4 w-4 rounded border-gray-300"
              required
            />
            <label htmlFor="employerTerms" className="text-sm text-gray-500">
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
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="verified"
              name="verified"
              className="mt-1 h-4 w-4 rounded border-gray-300"
              required
            />
            <label htmlFor="verified" className="text-sm text-gray-500">
              I confirm that I am an authorized representative of this company
              and have the right to register on its behalf
            </label>
          </div>
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="updates"
              name="updates"
              className="mt-1 h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="updates" className="text-sm text-gray-500">
              Send me product updates, hiring tips, and promotional offers via
              email
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 text-base font-semibold text-white transition-colors hover:bg-slate-800"
        >
          <Building2 className="h-4 w-4" />
          Register Company
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

export function EmployerHighlights() {
  const highlights = [
    {
      icon: Users,
      title: 'Access Top Talent',
      description:
        'Connect with thousands of qualified candidates actively looking for opportunities',
    },
    {
      icon: Zap,
      title: 'Easy Job Posting',
      description:
        'Post jobs in minutes with our intuitive interface and smart templates',
    },
    {
      icon: ChartLine,
      title: 'Smart Analytics',
      description:
        'Track applications and optimize your hiring with detailed insights',
    },
  ];

  return (
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
  );
}

export default EmployerRegisterForm;
