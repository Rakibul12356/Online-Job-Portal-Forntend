import {
  BarChart3,
  Briefcase,
  Calendar,
  DollarSign,
  MapPin,
  Users,
} from 'lucide-react';

const overviewItems = [
  { key: 'jobType', label: 'Job Type', icon: Briefcase, getValue: (job) => job.jobType },
  {
    key: 'location',
    label: 'Location',
    icon: MapPin,
    getValue: (job) => job.locationDetail,
  },
  {
    key: 'salary',
    label: 'Salary',
    icon: DollarSign,
    getValue: (job) => job.salaryDetail,
  },
  {
    key: 'experience',
    label: 'Experience',
    icon: BarChart3,
    getValue: (job) => job.experience,
  },
  {
    key: 'deadline',
    label: 'Application Deadline',
    icon: Calendar,
    getValue: (job) => job.deadline,
  },
  {
    key: 'applicants',
    label: 'Applicants',
    icon: Users,
    getValue: (job) => `${job.applicants} applications`,
  },
];

export function JobOverview({ job }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
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
