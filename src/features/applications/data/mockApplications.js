import {
  Building2,
  Code,
  Database,
  Palette,
  Smartphone,
} from 'lucide-react';

export const statusFilters = [
  { id: 'all', label: 'All', count: 12 },
  { id: 'under-review', label: 'Under Review', count: 5 },
  { id: 'shortlisted', label: 'Shortlisted', count: 3 },
  { id: 'rejected', label: 'Rejected', count: 2 },
];

export const dateFilters = [
  { id: 'all', label: 'All Time' },
  { id: '7days', label: 'Last 7 Days' },
  { id: '30days', label: 'Last 30 Days' },
  { id: '3months', label: 'Last 3 Months' },
];

export const sortOptions = ['Newest First', 'Oldest First'];

export const statusStyles = {
  'under-review': 'bg-amber-100 text-amber-800',
  shortlisted: 'bg-blue-100 text-blue-800',
  rejected: 'bg-red-100 text-red-800',
};

export const appliedJobs = [
  {
    id: '1',
    jobId: '1',
    title: 'Senior Full Stack Developer',
    company: 'TechCorp Solutions',
    location: 'San Francisco, CA',
    jobType: 'Full-time',
    salary: '$120k - $160k',
    appliedOn: 'Applied on Nov 25, 2025',
    status: 'Under Review',
    statusKey: 'under-review',
    icon: Building2,
    showWithdraw: false,
    faded: false,
  },
  {
    id: '2',
    jobId: '4',
    title: 'Frontend Developer',
    company: 'Digital Innovations Inc',
    location: 'Remote',
    jobType: 'Full-time',
    salary: '$90k - $130k',
    appliedOn: 'Applied on Nov 28, 2025',
    status: 'Under Review',
    statusKey: 'under-review',
    icon: Code,
    showWithdraw: true,
    faded: false,
  },
  {
    id: '3',
    jobId: 'rec-3',
    title: 'Mobile App Developer',
    company: 'AppWorks Studio',
    location: 'New York, NY',
    jobType: 'Full-time',
    salary: '$100k - $140k',
    appliedOn: 'Applied on Nov 20, 2025',
    status: 'Shortlisted',
    statusKey: 'shortlisted',
    icon: Smartphone,
    showWithdraw: false,
    faded: false,
  },
  {
    id: '4',
    jobId: 'rec-2',
    title: 'Backend Engineer',
    company: 'DataFlow Systems',
    location: 'Austin, TX',
    jobType: 'Full-time',
    salary: '$110k - $150k',
    appliedOn: 'Applied on Nov 15, 2025',
    status: null,
    statusKey: null,
    icon: Database,
    showWithdraw: true,
    faded: false,
  },
  {
    id: '5',
    jobId: '2',
    title: 'UI/UX Designer',
    company: 'Creative Labs',
    location: 'Los Angeles, CA',
    jobType: 'Full-time',
    salary: '$80k - $120k',
    appliedOn: 'Applied on Nov 10, 2025',
    status: 'Not Selected',
    statusKey: 'rejected',
    icon: Palette,
    showWithdraw: false,
    faded: true,
  },
];
