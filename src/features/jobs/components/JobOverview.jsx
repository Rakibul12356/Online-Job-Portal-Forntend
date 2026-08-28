import {
  BarChart3,
  Briefcase,
  Calendar,
  DollarSign,
  MapPin,
  Users,
} from 'lucide-react';
import { formatDate } from '@/utils';


const overviewItems = [
  { key: 'jobType', label: 'Job Type', icon: Briefcase, getValue: (job) => job.jobType || 'Full-time' },
  {
    key: 'location',
    label: 'Location',
    icon: MapPin,
    getValue: (job) => job.locationDetail || job.city || job.location || 'Remote',
  },
  {
    key: 'salary',
    label: 'Salary',
    icon: DollarSign,
    getValue: (job) => {
      if (job.salaryDetail) return job.salaryDetail;
      if (job.salary) return job.salary;
      if (job.salaryMin && job.salaryMax) {
        return `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()} per year`;
      }
      return 'Salary Negotiable';
    },
  },
  {
    key: 'experience',
    label: 'Experience',
    icon: BarChart3,
    getValue: (job) => job.experience || 'Entry level',
  },
  {
    key: 'deadline',
    label: 'Application Deadline',
    icon: Calendar,
    getValue: (job) => (job.deadline ? formatDate(job.deadline) : 'N/A'),
  },
  {
    key: 'applicants',
    label: 'Applicants',
    icon: Users,
    getValue: (job) => `${job.applicants ?? 0} applications`,
  },
];

export function JobOverview({ job }) {
  return (
    <div className="job-overview-card rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Job Overview</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {overviewItems.map(({ key, label, icon: Icon, getValue }) => (
          <div key={key} className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
              <Icon className="h-5 w-5 text-slate-900" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="font-medium">{getValue(job)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobOverview;
