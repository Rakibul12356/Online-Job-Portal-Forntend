import { useEffect, useState } from 'react';
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
  X,
  MessageSquare,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { employerService } from '@/services';
import { LoadingSpinner } from '@/components';
import { sanitizeMediaUrl } from '@/config/env';
import { useToast } from '@/context';
import { formatDate, formatTimeAgo } from '@/utils';

export function CompanyDashboardContent({ firstName = 'TechCorp' }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shortlistingAppId, setShortlistingAppId] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      setError(null);
      try {
        const response = await employerService.getDashboard();
        if (response.success && response.data) {
          setData(response.data);
        } else {
          setError('Failed to fetch dashboard data');
        }
      } catch (err) {
        console.error('Error fetching company dashboard:', err);
        setError(err.message || 'Error connecting to API server');
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const handleShortlist = async (appId) => {
    setShortlistingAppId(appId);
    try {
      const response = await employerService.updateApplicantStatus(appId, 'shortlisted');
      if (response.success) {
        toast.success('Applicant status updated to shortlisted!');
        // Refresh local dashboard data
        const updated = await employerService.getDashboard();
        if (updated.success) setData(updated.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update applicant status');
    } finally {
      setShortlistingAppId(null);
    }
  };

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

  const { stats = {}, recentJobs = [], recentApplicants = [] } = data || {};

  const statsList = [
    { label: 'Active Job Posts', value: stats.activeJobs ?? 0, icon: Briefcase, color: 'text-slate-900 border-gray-200' },
    { label: 'Total Applicants', value: stats.totalApplicants ?? 0, icon: Users, color: 'text-blue-600 border-blue-100 bg-blue-50/10' },
    { label: 'Pending Reviews', value: stats.pendingReviews ?? 0, icon: Clock, color: 'text-amber-600 border-amber-100 bg-amber-50/10' },
    { label: 'Shortlisted Candidates', value: stats.shortlisted ?? 0, icon: Star, color: 'text-green-600 border-green-100 bg-green-50/10' },
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Welcome back, {firstName}! 👋</h1>
        <p className="text-gray-500">
          Here&apos;s what&apos;s happening with your job postings today
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsList.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`rounded-lg border bg-white p-6 shadow-sm ${stat.color}`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                  <Icon className="h-6 w-6" />
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
                <Link
                  to={ROUTES.MANAGE_JOBS}
                  className="text-sm text-slate-900 hover:underline"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {recentJobs.length === 0 ? (
                <p className="p-6 text-center text-sm text-gray-500">No active job postings.</p>
              ) : (
                recentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-6 transition-colors hover:bg-gray-50"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="mb-1 font-semibold">
                          <Link
                            to={ROUTES.JOB_DETAIL.replace(':jobId', job.id)}
                            className="hover:text-slate-700"
                          >
                            {job.title}
                          </Link>
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                          {job.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {job.location}
                            </span>
                          )}
                          {job.jobType && (
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              {job.jobType}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(job.postedLabel || job.postedAt || job.createdAt || 'Recently')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        <span className="font-semibold text-gray-900">
                          {job.applicants ?? 0}
                        </span>{' '}
                        applicants
                      </span>
                      <div className="flex items-center gap-2">
                        <Link
                          to={ROUTES.JOB_DETAIL.replace(':jobId', job.id)}
                          className="flex h-8 items-center rounded-lg border border-gray-300 px-3 text-xs font-medium hover:bg-gray-50 text-slate-900"
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          View
                        </Link>
                        <Link
                          to={ROUTES.MANAGE_JOBS}
                          className="flex h-8 items-center rounded-lg border border-gray-300 px-3 text-xs font-medium hover:bg-gray-50 text-slate-900"
                        >
                          <Edit className="mr-1 h-3 w-3" />
                          Manage
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Applicants</h2>
                <Link
                  to={ROUTES.COMPANY_APPLICANTS}
                  className="text-sm text-slate-900 hover:underline"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {recentApplicants.length === 0 ? (
                <p className="p-6 text-center text-sm text-gray-500">No applicants yet.</p>
              ) : (
                recentApplicants.map((applicant) => (
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
                            <h3 className="mb-1 font-semibold">{applicant.seekerName}</h3>
                            <p className="text-sm text-gray-500">
                              Applied for{' '}
                              <span className="font-medium text-gray-900">
                                {applicant.jobTitle}
                              </span>
                            </p>
                          </div>
                          <span className="shrink-0 text-xs text-gray-500">
                            {applicant.appliedAt ? formatTimeAgo(applicant.appliedAt) : ''}
                          </span>
                        </div>
                        {applicant.seekerSkills && applicant.seekerSkills.length > 0 && (
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            {applicant.seekerSkills.slice(0, 4).map((skill) => (
                              <span
                                key={skill}
                                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex flex-wrap items-center gap-2">
                          {applicant.status === 'pending' && (
                             <button
                               type="button"
                               disabled={shortlistingAppId !== null}
                               onClick={() => handleShortlist(applicant.id)}
                               className="flex h-8 items-center rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white hover:bg-slate-800 disabled:bg-slate-800/80 disabled:cursor-not-allowed"
                             >
                               {shortlistingAppId === applicant.id ? (
                                 <span className="mr-1 h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                               ) : (
                                 <Check className="mr-1 h-3 w-3" />
                               )}
                               Shortlist
                             </button>
                           )}
                          <Link
                            to={ROUTES.COMPANY_APPLICANTS}
                            className="flex h-8 items-center rounded-lg border border-gray-300 px-3 text-xs font-medium hover:bg-gray-50 text-slate-900"
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            View Pipeline
                          </Link>
                          {applicant.resumeUrl && (
                            <a
                              href={sanitizeMediaUrl(applicant.resumeUrl)}
                              target="_blank"
                              rel="noreferrer"
                              className="flex h-8 items-center rounded-lg border border-gray-300 px-3 text-xs font-medium hover:bg-gray-50 text-slate-900"
                            >
                              <Download className="mr-1 h-3 w-3" />
                              Resume
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
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
                {
                  icon: List,
                  label: 'Manage Jobs',
                  to: ROUTES.MANAGE_JOBS,
                },
                { icon: Users, label: 'View Applicants', to: ROUTES.COMPANY_APPLICANTS },
                {
                  icon: MessageSquare,
                  label: 'Messages / Inbox',
                  to: ROUTES.CHAT,
                },
                {
                  icon: Settings,
                  label: 'Company Settings',
                  to: ROUTES.COMPANY_SETTINGS,
                },
              ].map(({ icon: Icon, label, primary, to }) => (
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
              ))}
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

