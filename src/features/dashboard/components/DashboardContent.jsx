import { Link } from 'react-router-dom';
import {
  Bookmark,
  Calendar,
  DollarSign,
  Edit,
  FileText,
  Lightbulb,
  MapPin,
  Settings,
  User,
} from 'lucide-react';
import { ROUTES } from '@/constants';
import {
  recentApplications,
  recommendedJobs,
  statusStyles,
} from '../data/mockDashboard';

function StatusBadge({ label, variant }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[variant]}`}
    >
      {label}
    </span>
  );
}

export function DashboardContent({ firstName = 'John' }) {
  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Welcome back, {firstName}! 👋</h1>
        <p className="text-gray-500">
          Here&apos;s what&apos;s happening with your job search today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Applications</h2>
              <Link
                to={ROUTES.APPLICATIONS}
                className="text-sm text-slate-900 hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentApplications.map((app) => {
                const Icon = app.icon;
                return (
                  <div
                    key={app.id}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                          <Icon className="h-6 w-6 text-slate-900" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <div>
                            <h3 className="mb-1 font-semibold">
                              <Link
                                to={ROUTES.JOB_DETAIL.replace(':jobId', app.jobId)}
                                className="hover:underline"
                              >
                                {app.title}
                              </Link>
                            </h3>
                            <p className="text-sm text-gray-500">{app.company}</p>
                          </div>
                          <StatusBadge
                            label={app.status}
                            variant={app.statusVariant}
                          />
                        </div>
                        <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {app.location}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {app.appliedOn}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {app.salary}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            to={ROUTES.JOB_DETAIL.replace(':jobId', app.jobId)}
                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
                          >
                            {app.primaryAction}
                          </Link>
                          <button
                            type="button"
                            className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
                          >
                            {app.secondaryAction}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recommended for You</h2>
              <Link
                to={ROUTES.HOME}
                className="text-sm text-slate-900 hover:underline"
              >
                Browse All Jobs
              </Link>
            </div>
            <div className="space-y-4">
              {recommendedJobs.map((job) => {
                const Icon = job.icon;
                return (
                  <article
                    key={job.id}
                    className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                          <Icon className="h-6 w-6 text-slate-900" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="mb-1 font-semibold">{job.title}</h3>
                        <p className="mb-2 text-sm text-gray-500">{job.company}</p>
                        <p className="mb-3 text-sm text-gray-500">{job.description}</p>
                        <div className="mb-3 flex flex-wrap gap-2">
                          {job.tags.map((tag, index) => (
                            <span
                              key={tag}
                              className={
                                index === 0
                                  ? 'rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium'
                                  : 'rounded-full border border-gray-300 px-2.5 py-0.5 text-xs font-medium text-gray-700'
                              }
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {job.location}
                            </span>
                            <span className="font-semibold text-slate-900">
                              {job.salary}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
                            >
                              View Details
                            </button>
                            <button
                              type="button"
                              className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                            >
                              Apply Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { icon: User, label: 'View Profile', to: ROUTES.PROFILE },
                { icon: Edit, label: 'Edit Profile', to: ROUTES.EDIT_PROFILE },
                {
                  icon: FileText,
                  label: 'My Applications',
                  to: ROUTES.APPLICATIONS,
                },
                { icon: Bookmark, label: 'Saved Jobs', to: ROUTES.SAVED_JOBS },
                { icon: Settings, label: 'Settings', to: '#' },
              ].map(({ icon: Icon, label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="flex items-center gap-3 rounded-md p-3 transition-colors hover:bg-gray-100"
                >
                  <Icon className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 shrink-0 text-blue-600" />
              <div>
                <h3 className="mb-1 text-sm font-semibold text-blue-900">
                  Pro Tip
                </h3>
                <p className="text-xs text-blue-700">
                  Applications submitted within 24 hours of posting have a 3x
                  higher response rate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardContent;
