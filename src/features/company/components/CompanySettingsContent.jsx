import { useState, useRef } from 'react';
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
} from 'lucide-react';
import { ROUTES } from '@/constants';
import { employerService } from '@/services';
import { sanitizeMediaUrl } from '@/config/env';
import {
  companySizeOptions,
  companyTypeOptions,
  settingsNavItems,
} from '../data/mockCompanySettings';

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900';

const navIcons = {
  building: Building2,
  phone: Phone,
  share: Share2,
  settings: Settings,
  'credit-card': CreditCard,
  shield: Shield,
};

const socialFields = [
  { id: 'linkedin', label: 'LinkedIn Profile', icon: Link2 },
  { id: 'twitter', label: 'Twitter/X Profile', icon: Share2 },
  { id: 'facebook', label: 'Facebook Page', icon: Share2 },
  { id: 'instagram', label: 'Instagram Profile', icon: Share2 },
  { id: 'github', label: 'GitHub Organization', icon: Code },
];

export function CompanySettingsContent({ user, settings }) {
  const [activeSection, setActiveSection] = useState('company-info');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [logoLoading, setLogoLoading] = useState(false);
  const logoInputRef = useRef(null);

  const [form, setForm] = useState({
    companyName: settings?.companyName || user?.name || '',
    industry: settings?.industry || '',
    companySize: settings?.companySize || '',
    companyType: settings?.companyType || '',
    website: settings?.website || '',
    founded: settings?.founded || '',
    about: settings?.about || '',
    city: settings?.location?.city || '',
    state: settings?.location?.state || '',
    country: settings?.location?.country || '',
    phone: settings?.contact?.phone || '',
    hrEmail: settings?.contact?.hrEmail || '',
    supportEmail: settings?.contact?.supportEmail || '',
    linkedin: settings?.social?.linkedin || '',
    twitter: settings?.social?.twitter || '',
    facebook: settings?.social?.facebook || '',
    instagram: settings?.social?.instagram || '',
    github: settings?.social?.github || '',
  });

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
    setLogoLoading(true);
    try {
      const response = await employerService.uploadLogo(file);
      if (response.success) {
        alert('Logo uploaded successfully!');
        window.location.reload();
      }
    } catch (err) {
      alert(err.message || 'Failed to upload logo');
    } finally {
      setLogoLoading(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!window.confirm('Are you sure you want to remove the logo?')) return;
    setLogoLoading(true);
    try {
      const response = await employerService.removeLogo();
      if (response.success) {
        alert('Logo removed successfully!');
        window.location.reload();
      }
    } catch (err) {
      alert(err.message || 'Failed to remove logo');
    } finally {
      setLogoLoading(false);
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    
    const payload = {
      companyName: form.companyName,
      industry: form.industry,
      companySize: form.companySize,
      companyType: form.companyType,
      website: form.website,
      founded: form.founded,
      about: form.about,
      location: {
        city: form.city,
        state: form.state,
        country: form.country,
      },
      contact: {
        phone: form.phone,
        hrEmail: form.hrEmail,
        supportEmail: form.supportEmail,
      },
      social: {
        linkedin: form.linkedin,
        twitter: form.twitter,
        facebook: form.facebook,
        instagram: form.instagram,
        github: form.github,
      },
    };

    try {
      const response = await employerService.updateCompanySettings(payload);
      if (response.success) {
        alert('Company settings saved successfully!');
        window.location.reload();
      } else {
        setError(response.message || 'Failed to save settings');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error occurred while saving settings');
    } finally {
      setSaving(false);
    }
  }

  const displayName = form.companyName || user?.name || 'Company Profile';

  return (
    <div>
      <div className="mb-8">
        <nav className="mb-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link to={ROUTES.DASHBOARD} className="hover:text-slate-900">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900">Company Settings</span>
        </nav>
        <div>
          <h1 className="mb-2 text-3xl font-bold">Company Settings</h1>
          <p className="text-gray-500">
            Manage your company profile and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <nav className="space-y-1">
              {settingsNavItems.map(({ id, label, icon }) => {
                const Icon = navIcons[icon];
                const isActive = activeSection === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => scrollToSection(id)}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-100 border border-gray-200">
                {settings?.logoUrl ? (
                  <img src={sanitizeMediaUrl(settings.logoUrl)} alt={displayName} className="h-full w-full object-cover" />
                ) : (
                  <Building2 className="h-10 w-10 text-gray-500" />
                )}
              </div>
              <h3 className="mb-1 font-semibold">{displayName}</h3>
              {settings?.industry && (
                <p className="mb-4 text-xs text-gray-500">
                  {settings.industry}
                </p>
              )}
            </div>
          </div>
        </aside>

        <form className="space-y-6 lg:col-span-3" onSubmit={handleSubmit}>
          <section
            id="company-info"
            className="scroll-mt-24 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="mb-6 text-xl font-semibold">Company Information</h2>

            <div className="mb-6">
              <p className="mb-2 text-sm font-medium">Company Logo</p>
              <div className="flex items-start gap-6">
                <div className="relative">
                  <input
                    ref={logoInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={logoLoading}
                  />
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                    {settings?.logoUrl ? (
                      <img src={sanitizeMediaUrl(settings.logoUrl)} alt="Logo" className="h-full w-full object-cover" />
                    ) : (
                      <Building2 className="h-12 w-12 text-gray-500" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={logoLoading}
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
                      className="flex cursor-pointer items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Logo
                    </button>
                    {settings?.logoUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        disabled={logoLoading}
                        className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 text-red-600 disabled:opacity-50"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove Logo
                      </button>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Recommended size: 200x200px. Max file size: 2MB. Supported
                    formats: JPG, PNG, SVG
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="companyName" className="mb-2 block text-sm font-medium">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={form.companyName}
                  onChange={(e) => updateField('companyName', e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label htmlFor="industry" className="mb-2 block text-sm font-medium">
                  Industry <span className="text-red-500">*</span>
                </label>
                <input
                  id="industry"
                  type="text"
                  value={form.industry}
                  onChange={(e) => updateField('industry', e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="companySize" className="mb-2 block text-sm font-medium">
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
                <label htmlFor="companyType" className="mb-2 block text-sm font-medium">
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

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="website" className="mb-2 block text-sm font-medium">
                  Website <span className="text-red-500">*</span>
                </label>
                <input
                  id="website"
                  type="url"
                  value={form.website}
                  onChange={(e) => updateField('website', e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label htmlFor="founded" className="mb-2 block text-sm font-medium">
                  Founded Year
                </label>
                <input
                  id="founded"
                  type="text"
                  value={form.founded}
                  onChange={(e) => updateField('founded', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="about" className="mb-2 block text-sm font-medium">
                About Company <span className="text-red-500">*</span>
              </label>
              <textarea
                id="about"
                rows={6}
                value={form.about}
                onChange={(e) => updateField('about', e.target.value)}
                className={`${inputClass} resize-none`}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { id: 'city', label: 'City' },
                { id: 'state', label: 'State/Province' },
                { id: 'country', label: 'Country' },
              ].map(({ id, label }) => (
                <div key={id}>
                  <label htmlFor={id} className="mb-2 block text-sm font-medium">
                    {label}
                  </label>
                  <input
                    id={id}
                    type="text"
                    value={form[id]}
                    onChange={(e) => updateField(id, e.target.value)}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </section>

          <section
            id="contact"
            className="scroll-mt-24 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="mb-6 text-xl font-semibold">Contact Information</h2>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="hrEmail" className="mb-2 block text-sm font-medium">
                  HR Department Email
                </label>
                <input
                  id="hrEmail"
                  type="email"
                  value={form.hrEmail}
                  onChange={(e) => updateField('hrEmail', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="supportEmail"
                  className="mb-2 block text-sm font-medium"
                >
                  Information Email
                </label>
                <input
                  id="supportEmail"
                  type="email"
                  value={form.supportEmail}
                  onChange={(e) => updateField('supportEmail', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section
            id="social"
            className="scroll-mt-24 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="mb-6 text-xl font-semibold">Social Media Links</h2>
            <div className="space-y-4">
              {socialFields.map(({ id, label, icon: Icon }) => (
                <div key={id}>
                  <label htmlFor={id} className="mb-2 block text-sm font-medium">
                    {label}
                  </label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <input
                      id={id}
                      type="url"
                      value={form[id]}
                      onChange={(e) => updateField(id, e.target.value)}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="flex flex-col gap-4 pt-4">
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            <div className="flex items-center justify-between gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompanySettingsContent;
