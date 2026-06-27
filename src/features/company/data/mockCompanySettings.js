export const companySettingsData = {
  name: 'TechCorp Solutions',
  membership: 'Premium Member',
  stats: {
    activeJobs: 24,
    totalApplicants: 156,
    memberSince: 'Jan 2024',
  },
  companyName: 'TechCorp Solutions',
  industry: 'Information Technology',
  companySize: '500',
  companyType: 'private',
  website: 'https://techcorp.example.com',
  founded: '2015',
  about: `TechCorp Solutions is a leading technology company specializing in innovative software solutions. We are committed to delivering cutting-edge products and services that help businesses transform digitally. Our team of experienced professionals works on challenging projects across various domains including cloud computing, AI/ML, and mobile applications.

We pride ourselves on fostering a culture of innovation, collaboration, and continuous learning. Join us to be part of a dynamic team that's shaping the future of technology.`,
  city: 'San Francisco',
  state: 'California',
  country: 'United States',
  phone: '+1 (555) 123-4567',
  hrEmail: 'hr@techcorp.com',
  supportEmail: 'support@techcorp.com',
  linkedin: 'https://linkedin.com/company/techcorp',
  twitter: 'https://twitter.com/techcorp',
  facebook: 'https://facebook.com/techcorp',
  instagram: 'https://instagram.com/techcorp',
  github: 'https://github.com/techcorp',
};

export const companySizeOptions = [
  { value: '', label: 'Select company size' },
  { value: '1-10', label: '1-10 employees' },
  { value: '50', label: '11-50 employees' },
  { value: '200', label: '51-200 employees' },
  { value: '500', label: '201-500 employees' },
  { value: '1000', label: '501-1000 employees' },
  { value: '5000', label: '1001-5000 employees' },
  { value: '10000', label: '5001-10000 employees' },
  { value: '10001+', label: '10000+ employees' },
];

export const companyTypeOptions = [
  { value: '', label: 'Select company type' },
  { value: 'startup', label: 'Startup' },
  { value: 'private', label: 'Private Company' },
  { value: 'public', label: 'Public Company' },
  { value: 'non-profit', label: 'Non-Profit' },
  { value: 'government', label: 'Government Agency' },
  { value: 'educational', label: 'Educational Institution' },
  { value: 'self-employed', label: 'Self-Employed' },
  { value: 'partnership', label: 'Partnership' },
];

export const settingsNavItems = [
  { id: 'company-info', label: 'Company Info', icon: 'building' },
  { id: 'contact', label: 'Contact Details', icon: 'phone' },
  { id: 'social', label: 'Social Media', icon: 'share' },
  { id: 'preferences', label: 'Preferences', icon: 'settings' },
  { id: 'billing', label: 'Billing', icon: 'credit-card' },
  { id: 'account', label: 'Account Security', icon: 'shield' },
];
