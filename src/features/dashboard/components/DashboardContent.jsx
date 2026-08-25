import { useEffect, useState } from 'react';
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
  Briefcase,
} from 'lucide-react';
import { ROUTES } from '@/constants';
import { seekerService } from '@/services';
import { LoadingSpinner } from '@/components';

const statusBadgeStyles = {
  pending: 'bg-amber-100 text-amber-800 border border-amber-200',
  shortlisted: 'bg-green-100 text-green-800 border border-green-200',
  interviewed: 'bg-blue-100 text-blue-800 border border-blue-200',
  rejected: 'bg-red-100 text-red-800 border border-red-200',
  withdrawn: 'bg-gray-100 text-gray-800 border border-gray-200',
};

const statusLabels = {
  pending: 'Pending Review',
  shortlisted: 'Shortlisted',
  interviewed: 'Interview Scheduled',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

function StatusBadge({ status }) {
  const badgeStyle = statusBadgeStyles[status] || 'bg-gray-100 text-gray-800';
  const label = statusLabels[status] || status;
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeStyle}`}>
      {label}
    </span>
  );
}

export function DashboardContent({ firstName = 'User' }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      setError(null);
      try {
        const response = await seekerService.getDashboard();
        if (response.success && response.data) {
          setData(response.data);
        } else {
          setError('Failed to fetch dashboard statistics');
        }
      } catch (err) {
        console.error('Error fetching dashboard:', err);
        setError(err.message || 'Error connecting to API server');
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-center text-red-600">
        {error}
      </div>
    );
  }

  const { stats = {}, recentApplied = [], recommendedJobs = [] } = data || {};

  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Welcome back, {firstName}! 👋</h1>
        <p className="text-gray-500">
          Here&apos;s what&apos;s happening with your job search today.
        </p>
      </div>

      {/* Stats Section */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Applications', value: stats.totalApplications ?? 0, color: 'text-slate-900 border-gray-200' },
          { label: 'Shortlisted', value: stats.shortlisted ?? 0, color: 'text-green-600 border-green-100 bg-green-50/30' },
          { label: 'Pending Reviews', value: stats.pendingReviews ?? 0, color: 'text-amber-600 border-amber-100 bg-amber-50/30' },
          { label: 'Saved Jobs', value: stats.savedJobs ?? 0, color: 'text-blue-600 border-blue-100 bg-blue-50/30' },
        ].map((item) => (
          <div key={item.label} className={`rounded-lg border bg-white p-4 shadow-sm ${item.color}`}>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{item.label}</p>
            <p className="mt-1 text-2xl font-bold">{item.value}</p>
          </div>
        ))}
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
            
            {recentApplied.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-500">No applications submitted yet.</p>
            ) : (
              <div className="space-y-4">
                {recentApplied.map((app) => {
                  return (
                    <div
                      key={app.id}
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="shrink-0">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                            <Briefcase className="h-6 w-6 text-slate-900" />
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
                                  {app.jobTitle}
                                </Link>
                              </h3>
                              <p className="text-sm text-gray-500">{app.company}</p>
                            </div>
                            <StatusBadge status={app.status} />
                          </div>
                          <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Applied on {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : ''}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link
                              to={ROUTES.JOB_DETAIL.replace(':jobId', app.jobId)}
                              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
                            >
                              View Job
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
            
            {recommendedJobs.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-500">No recommendations found.</p>
            ) : (
              <div className="space-y-4">
                {recommendedJobs.map((job) => {
                  return (
                    <article
                      key={job.id}
                      className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-start gap-4">
                        <div className="shrink-0">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                            <Briefcase className="h-6 w-6 text-slate-900" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="mb-1 font-semibold">{job.title}</h3>
                          <p className="mb-2 text-sm text-gray-500">{job.company}</p>
                          <p className="mb-3 text-sm text-gray-500 line-clamp-2">{job.description}</p>
                          <div className="mb-3 flex flex-wrap gap-2">
                            {(job.tags || []).map((tag, index) => (
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
                              {job.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {job.location}
                                </span>
                              )}
                              {job.salary && (
                                <span className="font-semibold text-slate-900">
                                  {job.salary}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Link
                                to={ROUTES.JOB_DETAIL.replace(':jobId', job.id)}
                                className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
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

