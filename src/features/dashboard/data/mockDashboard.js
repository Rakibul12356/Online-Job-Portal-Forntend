import {
  Building2,
  Code,
  Cpu,
  Database,
  Monitor,
  Smartphone,
} from 'lucide-react';

export const recentApplications = [
  {
    id: '1',
    jobId: '1',
    title: 'Senior Full Stack Developer',
    company: 'TechCorp Solutions',
    location: 'San Francisco, CA',
    appliedOn: 'Applied on Nov 28, 2025',
    salary: '$120k - $180k',
    status: 'Under Review',
    statusVariant: 'success',
    icon: Building2,
    primaryAction: 'View Job',
    secondaryAction: 'Withdraw Application',
  },
  {
    id: '4',
    jobId: '4',
    title: 'Frontend Developer (React)',
    company: 'Innovate Labs',
    location: 'Seattle, WA',
    appliedOn: 'Applied on Nov 25, 2025',
    salary: '$95k - $140k',
    status: 'Interview Scheduled',
    statusVariant: 'info',
    icon: Code,
    primaryAction: 'View Job',
    secondaryAction: 'Reschedule',
  },
  {
    id: '2',
    jobId: '2',
    title: 'UI/UX Designer',
    company: 'Design Studio Pro',
    location: 'New York, NY',
    appliedOn: 'Applied on Nov 20, 2025',
    salary: '$90k - $130k',
    status: 'Pending',
    statusVariant: 'warning',
    icon: Monitor,
    primaryAction: 'View Job',
    secondaryAction: 'Withdraw Application',
  },
];

export const recommendedJobs = [
  {
    id: 'rec-1',
    title: 'Full Stack JavaScript Developer',
    company: 'WebTech Industries',
    description:
      'Join our team to build scalable web applications using modern JavaScript frameworks.',
    location: 'Remote',
    salary: '$115k - $165k',
    tags: ['Full-time', 'Remote', 'React', 'Node.js'],
    icon: Cpu,
  },
  {
    id: 'rec-2',
    title: 'Backend Engineer (Node.js)',
    company: 'DataFlow Solutions',
    description: 'Build robust APIs and microservices for our enterprise platform.',
    location: 'Boston, MA',
    salary: '$125k - $170k',
    tags: ['Full-time', 'Hybrid', 'Node.js', 'MongoDB'],
    icon: Database,
  },
  {
    id: 'rec-3',
    title: 'React Native Developer',
    company: 'Mobile Innovations Inc',
    description: 'Develop cross-platform mobile applications for iOS and Android.',
    location: 'Austin, TX',
    salary: '$110k - $155k',
    tags: ['Full-time', 'Remote', 'React Native', 'TypeScript'],
    icon: Smartphone,
  },
];

export const statusStyles = {
  success: 'bg-green-100 text-green-800',
  info: 'bg-blue-100 text-blue-800',
  warning: 'bg-amber-100 text-amber-800',
};
