export const companyApplicants = [
  {
    id: '1',
    name: 'John Doe',
    initials: 'JD',
    avatarGradient: 'from-blue-500 to-purple-600',
    email: 'john.doe@example.com',
    experience: '7 years experience',
    experienceLevel: 'senior',
    appliedAt: 'Applied 2 hours ago',
    appliedHoursAgo: 2,
    status: 'New',
    statusVariant: 'info',
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS'],
    showShortlist: true,
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    initials: 'SW',
    avatarGradient: 'from-green-500 to-teal-600',
    email: 'sarah.wilson@example.com',
    experience: '5 years experience',
    experienceLevel: 'mid',
    appliedAt: 'Applied 5 hours ago',
    appliedHoursAgo: 5,
    status: 'Shortlisted',
    statusVariant: 'success',
    skills: ['React', 'Vue.js', 'Node.js', 'MongoDB', 'Docker'],
    showShortlist: false,
  },
  {
    id: '3',
    name: 'Michael Johnson',
    initials: 'MJ',
    avatarGradient: 'from-orange-500 to-red-600',
    email: 'michael.j@example.com',
    experience: '6 years experience',
    experienceLevel: 'senior',
    appliedAt: 'Applied 1 day ago',
    appliedHoursAgo: 24,
    status: 'New',
    statusVariant: 'info',
    skills: ['Full Stack', 'Python', 'Django', 'PostgreSQL', 'Redis'],
    showShortlist: true,
  },
  {
    id: '4',
    name: 'Emily Davis',
    initials: 'ED',
    avatarGradient: 'from-pink-500 to-rose-600',
    email: 'emily.davis@example.com',
    experience: '8 years experience',
    experienceLevel: 'senior',
    appliedAt: 'Applied 1 day ago',
    appliedHoursAgo: 26,
    status: 'Shortlisted',
    statusVariant: 'success',
    skills: ['Angular', 'TypeScript', 'RxJS', 'NestJS', 'GraphQL'],
    showShortlist: false,
  },
  {
    id: '5',
    name: 'Robert Martinez',
    initials: 'RM',
    avatarGradient: 'from-indigo-500 to-purple-600',
    email: 'robert.m@example.com',
    experience: '4 years experience',
    experienceLevel: 'mid',
    appliedAt: 'Applied 2 days ago',
    appliedHoursAgo: 48,
    status: 'New',
    statusVariant: 'info',
    skills: ['JavaScript', 'Express', 'MySQL', 'Git', 'Jenkins'],
    showShortlist: true,
  },
];

export const statusFilterConfig = [
  { id: 'new', label: 'New Applications', count: 8, statusMatch: 'New' },
  { id: 'shortlisted', label: 'Shortlisted', count: 8, statusMatch: 'Shortlisted' },
  { id: 'interviewed', label: 'Interviewed', count: 5, statusMatch: 'Interviewed' },
  { id: 'rejected', label: 'Rejected', count: 3, statusMatch: 'Rejected' },
];

export const experienceFilterConfig = [
  { id: 'entry', label: 'Entry Level (0-2 years)', levelMatch: 'entry' },
  { id: 'mid', label: 'Mid Level (3-5 years)', levelMatch: 'mid' },
  { id: 'senior', label: 'Senior (5+ years)', levelMatch: 'senior' },
];

export const dateFilterOptions = [
  { id: '24h', label: 'Last 24 hours', maxHours: 24 },
  { id: '7d', label: 'Last 7 days', maxHours: 168 },
  { id: '30d', label: 'Last 30 days', maxHours: 720 },
  { id: 'all', label: 'All time', maxHours: Infinity },
];

export const statusStyles = {
  info: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
};

export const defaultStatusFilters = {
  new: true,
  shortlisted: true,
  interviewed: false,
  rejected: false,
};

export const defaultExperienceFilters = {
  entry: false,
  mid: true,
  senior: true,
};

export const defaultDateFilter = '24h';
