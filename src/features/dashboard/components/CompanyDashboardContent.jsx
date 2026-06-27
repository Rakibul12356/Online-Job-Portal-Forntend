import {
  Briefcase,
  Building2,
  Check,
  Clock,
  Download,
  Edit,
  Eye,
  Lightbulb,
  List,
  MapPin,
  Plus,
  Settings,
  Star,
  User,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import {
  companyStats,
  recentApplicants,
  recentJobPosts,
  statIconStyles,
} from '../data/mockCompanyDashboard';

const statIcons = {
  briefcase: Briefcase,
  users: Users,
  clock: Clock,
  star: Star,
};

export function CompanyDashboardContent({ firstName = 'TechCorp' }) {
  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Welcome back, {firstName}! 👋</h1>
        <p className="text-gray-500">
          Here&apos;s what&apos;s happening with your job postings today
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {companyStats.map((stat) => {
          const Icon = statIcons[stat.icon];
          const styles = statIconStyles[stat.color];
          return (
            <div
              key={stat.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${styles.bg}`}
                >
                  <Icon className={`h-6 w-6 ${styles.text}`} />
                </div>
              </div>
              <h3 className="mb-1 text-2xl font-bold">{stat.value}</h3>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Job Posts</h2>
                <button
                  type="button"
                  className="text-sm text-slate-900 hover:underline"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {recentJobPosts.map((job) => (
                <div
                  key={job.id}
                  className="p-6 transition-colors hover:bg-gray-50"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="mb-1 font-semibold">
                        <button
                          type="button"
                          className="hover:text-slate-700"
                        >
                          {job.title}
                        </button>
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {job.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {job.posted}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      <span className="font-semibold text-gray-900">
                        {job.applicants}
                      </span>{' '}
                      applicants
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="flex h-8 items-center rounded-lg border border-gray-300 px-3 text-xs font-medium hover:bg-gray-50"
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </button>
                      <button
                        type="button"
                        className="flex h-8 items-center rounded-lg border border-gray-300 px-3 text-xs font-medium hover:bg-gray-50"
                      >
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Applicants</h2>
                <button
                  type="button"
                  className="text-sm text-slate-900 hover:underline"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {recentApplicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className="p-6 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <User className="h-6 w-6 text-slate-900" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div>
                          <h3 className="mb-1 font-semibold">{applicant.name}</h3>
                          <p className="text-sm text-gray-500">
                            Applied for{' '}
                            <span className="font-medium text-gray-900">
                              {applicant.jobTitle}
                            </span>
                          </p>
                        </div>
                        <span className="shrink-0 text-xs text-gray-500">
                          {applicant.appliedAt}
                        </span>
                      </div>
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        {applicant.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          className="flex h-8 items-center rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white hover:bg-slate-800"
                        >
                          <Check className="mr-1 h-3 w-3" />
                          Shortlist
                        </button>
                        <button
                          type="button"
                          className="flex h-8 items-center rounded-lg border border-gray-300 px-3 text-xs font-medium hover:bg-gray-50"
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          View Profile
                        </button>
                        <button
                          type="button"
                          className="flex h-8 items-center rounded-lg border border-gray-300 px-3 text-xs font-medium hover:bg-gray-50"
                        >
                          <Download className="mr-1 h-3 w-3" />
                          Resume
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
            <div className="space-y-2">
              {[
                {
                  icon: Plus,
                  label: 'Post New Job',
                  primary: true,
                  to: ROUTES.CREATE_JOB,
                },
                { icon: List, label: 'Manage Jobs' },
                { icon: Users, label: 'View Applicants' },
                {
                  icon: Settings,
                  label: 'Company Settings',
                  to: ROUTES.COMPANY_SETTINGS,
                },
              ].map(({ icon: Icon, label, primary, to }) =>
                to ? (
                  <Link
                    key={label}
                    to={to}
                    className={`flex w-full items-center justify-start rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      primary
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : 'border border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                  </Link>
                ) : (
                  <button
                    key={label}
                    type="button"
                    className={`flex w-full items-center justify-start rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      primary
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : 'border border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600">
                <Lightbulb className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-blue-900">Pro Tip</h4>
                <p className="text-sm text-blue-800">
                  Jobs with detailed descriptions get 40% more quality applicants.
                  Keep your postings updated!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CompanyDashboardContent;
