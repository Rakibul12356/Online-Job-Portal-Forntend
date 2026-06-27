export const companyStats = [
  {
    id: 'active-jobs',
    label: 'Active Jobs',
    value: 24,
    icon: 'briefcase',
    color: 'blue',
  },
  {
    id: 'total-applicants',
    label: 'Total Applicants',
    value: 156,
    icon: 'users',
    color: 'green',
  },
  {
    id: 'pending-reviews',
    label: 'Pending Reviews',
    value: 32,
    icon: 'clock',
    color: 'yellow',
  },
  {
    id: 'shortlisted',
    label: 'Shortlisted',
    value: 18,
    icon: 'star',
    color: 'purple',
  },
];

export const recentJobPosts = [
  {
    id: '1',
    title: 'Senior Full Stack Developer',
    location: 'San Francisco, CA',
    type: 'Full-time',
    posted: 'Posted 2 days ago',
    applicants: 24,
  },
  {
    id: '2',
    title: 'Frontend Developer',
    location: 'Remote',
    type: 'Full-time',
    posted: 'Posted 5 days ago',
    applicants: 18,
  },
  {
    id: '3',
    title: 'Backend Engineer',
    location: 'Austin, TX',
    type: 'Full-time',
    posted: 'Posted 1 week ago',
    applicants: 32,
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    location: 'Seattle, WA',
    type: 'Full-time',
    posted: 'Posted 2 weeks ago',
    applicants: 15,
  },
];

export const recentApplicants = [
  {
    id: '1',
    name: 'Sarah Johnson',
    jobTitle: 'Senior Full Stack Developer',
    appliedAt: '2 hours ago',
    skills: ['React', 'Node.js', 'AWS'],
  },
  {
    id: '2',
    name: 'Michael Chen',
    jobTitle: 'Frontend Developer',
    appliedAt: '5 hours ago',
    skills: ['Vue.js', 'TypeScript', 'CSS'],
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    jobTitle: 'Backend Engineer',
    appliedAt: '1 day ago',
    skills: ['Python', 'Django', 'PostgreSQL'],
  },
];

export const statIconStyles = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  green: { bg: 'bg-green-100', text: 'text-green-600' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
};
