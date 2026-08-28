import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Camera,
  ChevronRight,
  Code,
  CreditCard,
  Link2,
  Phone,
  Save,
  Settings,
  Share2,
  Shield,
  Upload,
  Trash2,
  Lock,
  Mail,
  Globe,
  MapPin,
} from 'lucide-react';
import { ROUTES } from '@/constants';
import { employerService } from '@/services';
import { sanitizeMediaUrl } from '@/config/env';
import { toast } from '@/context';
import {
  companySizeOptions,
  companyTypeOptions,
  settingsNavItems,
} from '../data/mockCompanySettings';

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-white';

const navIcons = {
  building: Building2,
  phone: Phone,
  share: Share2,
  settings: Settings,
  'credit-card': CreditCard,
  shield: Shield,
};

const socialFields = [
  { id: 'linkedin', label: 'LinkedIn Profile', icon: Link2, placeholder: 'https://linkedin.com/company/...' },
  { id: 'twitter', label: 'Twitter / X Profile', icon: Share2, placeholder: 'https://twitter.com/...' },
  { id: 'facebook', label: 'Facebook Page', icon: Share2, placeholder: 'https://facebook.com/...' },
  { id: 'instagram', label: 'Instagram Profile', icon: Share2, placeholder: 'https://instagram.com/...' },
  { id: 'github', label: 'GitHub Organization', icon: Code, placeholder: 'https://github.com/...' },
];

export function CompanySettingsContent({ user, settings }) {
  const [activeSection, setActiveSection] = useState('company-info');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [logoLoading, setLogoLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState(settings?.logoUrl || '');
  const logoInputRef = useRef(null);

  const [form, setForm] = useState({
    companyName: settings?.companyName || settings?.name || user?.name || '',
    accountEmail: settings?.accountEmail || user?.email || '',
    industry: settings?.industry || '',
    companySize: settings?.companySize || settings?.size || '',
    companyType: settings?.companyType || settings?.type || '',
    website: settings?.website || '',
    founded: settings?.founded || '',
    about: settings?.about || settings?.description || '',
    city: settings?.city || settings?.location?.city || '',
    state: settings?.state || settings?.location?.state || '',
    country: settings?.country || settings?.location?.country || '',
    phone: settings?.phone || settings?.contact?.phone || '',
    hrEmail: settings?.hrEmail || settings?.contact?.hrEmail || '',
    supportEmail: settings?.supportEmail || settings?.contact?.supportEmail || '',
    linkedin: settings?.linkedin || settings?.social?.linkedin || '',
    twitter: settings?.twitter || settings?.social?.twitter || '',
    facebook: settings?.facebook || settings?.social?.facebook || '',
    instagram: settings?.instagram || settings?.social?.instagram || '',
    github: settings?.github || settings?.social?.github || '',
  });

  useEffect(() => {
    if (settings) {
      setLogoUrl(settings.logoUrl || '');
      setForm((prev) => ({
        ...prev,
        companyName: settings.companyName || settings.name || user?.name || prev.companyName,
        accountEmail: settings.accountEmail || user?.email || prev.accountEmail,
        industry: settings.industry || prev.industry,
        companySize: settings.companySize || settings.size || prev.companySize,
        companyType: settings.companyType || settings.type || prev.companyType,
        website: settings.website || prev.website,
        founded: settings.founded || prev.founded,
        about: settings.about || settings.description || prev.about,
        city: settings.city || settings.location?.city || prev.city,
        state: settings.state || settings.location?.state || prev.state,
        country: settings.country || settings.location?.country || prev.country,
        phone: settings.phone || settings.contact?.phone || prev.phone,
        hrEmail: settings.hrEmail || settings.contact?.hrEmail || prev.hrEmail,
        supportEmail: settings.supportEmail || settings.contact?.supportEmail || prev.supportEmail,
        linkedin: settings.linkedin || settings.social?.linkedin || prev.linkedin,
        twitter: settings.twitter || settings.social?.twitter || prev.twitter,
        facebook: settings.facebook || settings.social?.facebook || prev.facebook,
        instagram: settings.instagram || settings.social?.instagram || prev.instagram,
        github: settings.github || settings.social?.github || prev.github,
      }));
    }
  }, [settings, user]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function scrollToSection(sectionId) {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo file size must not exceed 2MB');
      return;
    }

    setLogoLoading(true);
    try {
      const response = await employerService.uploadLogo(file);
      if (response.success) {
        const uploadedUrl = response.data?.logoUrl || response.logoUrl;
        if (uploadedUrl) {
          setLogoUrl(uploadedUrl);
        }
        toast.success('Company logo uploaded successfully!');
      } else {
        toast.error(response.message || 'Failed to upload logo');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to upload logo');
    } finally {
      setLogoLoading(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!window.confirm('Are you sure you want to remove the company logo?')) return;
    setLogoLoading(true);
    try {
      const response = await employerService.removeLogo();
      if (response.success) {
        setLogoUrl('');
        toast.success('Company logo removed successfully!');
      } else {
        toast.error(response.message || 'Failed to remove logo');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to remove logo');
    } finally {
      setLogoLoading(false);
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');

    // Prepare unified payload matching backend API requirements
    const payload = {
      companyName: form.companyName.trim(),
      industry: form.industry.trim(),
      companySize: form.companySize,
      companyType: form.companyType,
      website: form.website.trim(),
      founded: form.founded.trim(),
      about: form.about.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      country: form.country.trim(),
      phone: form.phone.trim(),
      hrEmail: form.hrEmail.trim(),
      supportEmail: form.supportEmail.trim(),
      linkedin: form.linkedin.trim(),
      twitter: form.twitter.trim(),
      facebook: form.facebook.trim(),
      instagram: form.instagram.trim(),
      github: form.github.trim(),
      location: {
        city: form.city.trim(),
        state: form.state.trim(),
        country: form.country.trim(),
      },
      contact: {
        phone: form.phone.trim(),
        hrEmail: form.hrEmail.trim(),
        supportEmail: form.supportEmail.trim(),
      },
      social: {
        linkedin: form.linkedin.trim(),
        twitter: form.twitter.trim(),
        facebook: form.facebook.trim(),
        instagram: form.instagram.trim(),
        github: form.github.trim(),
      },
    };

    try {
      const response = await employerService.updateCompanySettings(payload);
      if (response.success) {
        toast.success('Company profile updated successfully!');
      } else {
        const msg = response.message || 'Failed to save settings';
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      console.error(err);
      const msg = err.message || 'Error occurred while saving settings';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  const displayName = form.companyName || user?.name || 'Company Profile';

  return (
    <div>
      {/* Breadcrumb & Header */}
      <div className="mb-8">
        <nav className="mb-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link to={ROUTES.DASHBOARD} className="hover:text-slate-900 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Company Settings</span>
        </nav>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Company Settings</h1>
            <p className="mt-1 text-gray-500">
              Manage your company information, branding, locations, and public contacts
            </p>
          </div>
          <Link
            to={ROUTES.COMPANY_PROFILE}
            className="inline-flex items-center gap-2 self-start rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Globe className="h-4 w-4 text-gray-500" />
            View Public Profile
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <nav className="space-y-1">
              {settingsNavItems.map(({ id, label, icon }) => {
                const Icon = navIcons[icon] || Settings;
                const isActive = activeSection === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => scrollToSection(id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Preview Card */}
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-gray-100 border border-gray-200">
                {logoUrl ? (
                  <img src={sanitizeMediaUrl(logoUrl)} alt={displayName} className="h-full w-full object-cover" />
                ) : (
                  <Building2 className="h-10 w-10 text-gray-400" />
                )}
              </div>
              <h3 className="font-semibold text-gray-900">{displayName}</h3>
              {form.industry && (
                <p className="mt-0.5 text-xs text-gray-500 font-medium">
                  {form.industry}
                </p>
              )}
              {(form.city || form.country) && (
                <p className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {[form.city, form.country].filter(Boolean).join(', ')}
                </p>
              )}
            </div>
          </div>
        </aside>

        {/* Settings Form */}
        <form className="space-y-6 lg:col-span-3" onSubmit={handleSubmit}>
          {/* Company Information Section */}
          <section
            id="company-info"
            className="scroll-mt-24 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="mb-6 text-xl font-semibold text-slate-900">Company Information</h2>

            {/* Logo Upload */}
            <div className="mb-6 border-b border-gray-100 pb-6">
              <p className="mb-2 text-sm font-medium text-gray-900">Company Logo</p>
              <div className="flex items-start gap-6">
                <div className="relative">
                  <input
                    ref={logoInputRef}
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                    onChange={handleLogoUpload}
                    disabled={logoLoading}
                  />
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-gray-100 border border-gray-200">
                    {logoUrl ? (
                      <img src={sanitizeMediaUrl(logoUrl)} alt="Company Logo" className="h-full w-full object-cover" />
                    ) : (
                      <Building2 className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={logoLoading}
                    aria-label="Upload logo"
                    className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg hover:bg-slate-800 transition-transform hover:scale-105 cursor-pointer disabled:opacity-50"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      disabled={logoLoading}
                      className="flex cursor-pointer items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:bg-slate-800/80 disabled:cursor-not-allowed"
                    >
                      {logoLoading ? (
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      Upload Logo
                    </button>
                    {logoUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        disabled={logoLoading}
                        className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 text-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {logoLoading ? (
                          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-rose-600 border-t-transparent" />
                        ) : (
                          <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        Remove Logo
                      </button>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Recommended size: 200x200px. Max file size: 2MB. Supported formats: PNG, JPG, WEBP, SVG
                  </p>
                </div>
              </div>
            </div>

            {/* Read-Only Protected Account Email */}
            <div className="mb-6 rounded-lg bg-gray-50 p-4 border border-gray-200">
              <label className="mb-1.5 flex items-center justify-between text-sm font-medium text-gray-700">
                <span className="flex items-center gap-1.5 font-semibold text-gray-900">
                  <Lock className="h-4 w-4 text-gray-500" />
                  Account Login Email
                </span>
                <span className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600 font-medium">Read-Only</span>
              </label>
              <input
                type="email"
                value={form.accountEmail}
                disabled
                className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-600 cursor-not-allowed"
              />
              <p className="mt-1.5 text-xs text-gray-500">
                This is your primary login email and cannot be edited directly for security. You can set public HR and support contact emails below.
              </p>
            </div>

            {/* Company Name & Industry */}
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="companyName" className="mb-2 block text-sm font-medium text-gray-900">
                  Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={form.companyName}
                  onChange={(e) => updateField('companyName', e.target.value)}
                  className={inputClass}
                  required
                  placeholder="e.g. InnoTech Global Ltd"
                />
              </div>
              <div>
                <label htmlFor="industry" className="mb-2 block text-sm font-medium text-gray-900">
                  Industry <span className="text-rose-500">*</span>
                </label>
                <input
                  id="industry"
                  type="text"
                  value={form.industry}
                  onChange={(e) => updateField('industry', e.target.value)}
                  className={inputClass}
                  required
                  placeholder="e.g. Software & AI Solutions"
                />
              </div>
            </div>

            {/* Company Size & Type */}
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="companySize" className="mb-2 block text-sm font-medium text-gray-900">
                  Company Size
                </label>
                <select
                  id="companySize"
                  value={form.companySize}
                  onChange={(e) => updateField('companySize', e.target.value)}
                  className={inputClass}
                >
                  {companySizeOptions.map(({ value, label }) => (
                    <option key={value || 'empty'} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="companyType" className="mb-2 block text-sm font-medium text-gray-900">
                  Company Type
                </label>
                <select
                  id="companyType"
                  value={form.companyType}
                  onChange={(e) => updateField('companyType', e.target.value)}
                  className={inputClass}
                >
                  {companyTypeOptions.map(({ value, label }) => (
                    <option key={value || 'empty'} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Website & Founded */}
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="website" className="mb-2 block text-sm font-medium text-gray-900">
                  Website URL <span className="text-rose-500">*</span>
                </label>
                <input
                  id="website"
                  type="url"
                  value={form.website}
                  onChange={(e) => updateField('website', e.target.value)}
                  className={inputClass}
                  required
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label htmlFor="founded" className="mb-2 block text-sm font-medium text-gray-900">
                  Founded Year
                </label>
                <input
                  id="founded"
                  type="text"
                  value={form.founded}
                  onChange={(e) => updateField('founded', e.target.value)}
                  className={inputClass}
                  placeholder="e.g. 2019"
                />
              </div>
            </div>

            {/* About Company */}
            <div className="mb-4">
              <label htmlFor="about" className="mb-2 block text-sm font-medium text-gray-900">
                About Company <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="about"
                rows={5}
                value={form.about}
                onChange={(e) => updateField('about', e.target.value)}
                className={`${inputClass} resize-none`}
                required
                placeholder="Describe your company mission, culture, and achievements..."
              />
            </div>

            {/* Location Fields */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label htmlFor="city" className="mb-2 block text-sm font-medium text-gray-900">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  value={form.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Dhaka"
                />
              </div>
              <div>
                <label htmlFor="state" className="mb-2 block text-sm font-medium text-gray-900">
                  State / Division
                </label>
                <input
                  id="state"
                  type="text"
                  value={form.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Dhaka Division"
                />
              </div>
              <div>
                <label htmlFor="country" className="mb-2 block text-sm font-medium text-gray-900">
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  value={form.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Bangladesh"
                />
              </div>
            </div>
          </section>

          {/* Contact Information Section */}
          <section
            id="contact"
            className="scroll-mt-24 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="mb-6 text-xl font-semibold text-slate-900">Contact Information</h2>

            <div className="mb-4">
              <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-900">
                Official Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className={inputClass}
                required
                placeholder="+880 1811-122233"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="hrEmail" className="mb-2 block text-sm font-medium text-gray-900">
                  HR / Careers Email
                </label>
                <input
                  id="hrEmail"
                  type="email"
                  value={form.hrEmail}
                  onChange={(e) => updateField('hrEmail', e.target.value)}
                  className={inputClass}
                  placeholder="careers@company.com"
                />
              </div>
              <div>
                <label htmlFor="supportEmail" className="mb-2 block text-sm font-medium text-gray-900">
                  Public Support / General Email
                </label>
                <input
                  id="supportEmail"
                  type="email"
                  value={form.supportEmail}
                  onChange={(e) => updateField('supportEmail', e.target.value)}
                  className={inputClass}
                  placeholder="contact@company.com"
                />
              </div>
            </div>
          </section>

          {/* Social Media Section */}
          <section
            id="social"
            className="scroll-mt-24 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="mb-6 text-xl font-semibold text-slate-900">Social Media & Online Links</h2>
            <div className="space-y-4">
              {socialFields.map(({ id, label, icon: Icon, placeholder }) => (
                <div key={id}>
                  <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-900">
                    {label}
                  </label>
                  <div className="relative">
                    <Icon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      id={id}
                      type="url"
                      value={form[id]}
                      onChange={(e) => updateField(id, e.target.value)}
                      className={`${inputClass} pl-10`}
                      placeholder={placeholder}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Form Actions */}
          <div className="flex flex-col gap-4 pt-2">
            {error && (
              <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 border border-rose-200" role="alert">
                {error}
              </p>
            )}
            <div className="flex items-center justify-between gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors disabled:bg-slate-800/80 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {saving ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompanySettingsContent;
