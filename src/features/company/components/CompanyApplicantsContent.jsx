import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Calendar,
  ChevronRight,
  Eye,
  FileText,
  Mail,
  UserCheck,
  XCircle,
} from 'lucide-react';
import { ROUTES } from '@/constants';
import { employerService } from '@/services';
import { LoadingSpinner } from '@/components';
import { sanitizeMediaUrl } from '@/config/env';
import {
  dateFilterOptions,
  defaultDateFilter,
  defaultExperienceFilters,
  defaultStatusFilters,
  experienceFilterConfig,
  statusFilterConfig,
} from '../data/mockCompanyApplicants';

const statusStyles = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  shortlisted: 'bg-green-100 text-green-800 border-green-200',
  interviewed: 'bg-blue-100 text-blue-800 border-blue-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  withdrawn: 'bg-gray-100 text-gray-800 border-gray-200',
};

const statusLabels = {
  pending: 'Pending Review',
  shortlisted: 'Shortlisted',
  interviewed: 'Interview Scheduled',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

export function CompanyApplicantsContent() {
  const [statusFilters, setStatusFilters] = useState(defaultStatusFilters);
  const [experienceFilters, setExperienceFilters] = useState(defaultExperienceFilters);
  const [dateFilter, setDateFilter] = useState(defaultDateFilter);

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplicants = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};

      const activeStatus = Object.entries(statusFilters)
        .filter(([, enabled]) => enabled)
        .map(([key]) => key)[0];
      if (activeStatus) {
        params.status = activeStatus;
      }

      const activeExp = Object.entries(experienceFilters)
        .filter(([, enabled]) => enabled)
        .map(([key]) => key)[0];
      if (activeExp) {
        params.experienceLevel = activeExp;
      }

      if (dateFilter && dateFilter !== 'all') {
        params.date = dateFilter;
      }

      const response = await employerService.listApplicants(params);
      if (response.success && response.data) {
        setApplicants(response.data.items || []);
      } else {
        setError('Failed to fetch applicants list');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error occurred while loading applicants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [statusFilters, experienceFilters, dateFilter]);

  function resetFilters() {
    setStatusFilters(defaultStatusFilters);
    setExperienceFilters(defaultExperienceFilters);
    setDateFilter(defaultDateFilter);
  }

  function toggleStatusFilter(id) {
    setStatusFilters((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleExperienceFilter(id) {
    setExperienceFilters((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const handleUpdateStatus = async (appId, statusVal) => {
    if (!window.confirm(`Are you sure you want to mark this candidate as ${statusVal}?`)) return;
    try {
      const response = await employerService.updateApplicantStatus(appId, statusVal);
      if (response.success) {
        alert(`Candidate marked as ${statusVal}!`);
        fetchApplicants();
      }
    } catch (err) {
      alert(err.message || 'Failed to update applicant status');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <nav className="mb-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link to={ROUTES.DASHBOARD} className="hover:text-slate-900">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900">Applicants</span>
        </nav>
        <div>
          <h1 className="mb-2 text-3xl font-bold">Job Applicants</h1>
          <p className="text-gray-500">Review and manage applicants</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Filters</h3>
              <button
                type="button"
                onClick={resetFilters}
                className="text-sm text-slate-900 hover:underline"
              >
                Reset
              </button>
            </div>

            <div className="mb-6">
              <h4 className="mb-3 text-sm font-medium">Application Status</h4>
              <div className="space-y-2">
                {statusFilterConfig.map(({ id, label }) => (
                  <label
                    key={id}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={statusFilters[id] || false}
                      onChange={() => toggleStatusFilter(id)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="mb-3 text-sm font-medium">Experience Level</h4>
              <div className="space-y-2">
                {experienceFilterConfig.map(({ id, label }) => (
                  <label
                    key={id}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={experienceFilters[id] || false}
                      onChange={() => toggleExperienceFilter(id)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-medium">Applied Date</h4>
              <div className="space-y-2">
                {dateFilterOptions.map(({ id, label }) => (
                  <label
                    key={id}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="radio"
                      name="date"
                      checked={dateFilter === id}
                      onChange={() => setDateFilter(id)}
                      className="border-gray-300"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3">
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : applicants.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
              <p className="text-gray-500 font-medium">No candidates match your filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applicants.map((applicant) => {
                const name = applicant.seekerName || applicant.name || 'Candidate';
                const email = applicant.seekerEmail || applicant.email || '';
                const skillsList = applicant.seekerSkills || applicant.skills || [];
                const experience = applicant.seekerExperience || applicant.experience || 'N/A';
                const dateApplied = applicant.appliedAt ? new Date(applicant.appliedAt).toLocaleDateString() : 'N/A';
                const status = applicant.status;

                return (
                  <article
                    key={applicant.id}
                    className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md animate-fade-in"
                  >
                    <div className="flex flex-col gap-6 md:flex-row">
                      <div className="shrink-0">
                        <div
                          className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-xl font-bold text-white"
                        >
                          {name.substring(0, 2).toUpperCase()}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                          <div>
                            <h3 className="mb-1 text-lg font-semibold">{name}</h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Briefcase className="h-3 w-3" />
                                {experience}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {dateApplied}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-gray-500 font-medium">
                              Applied for: <span className="text-slate-900">{applicant.jobTitle || 'N/A'}</span>
                            </p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                              statusStyles[status] || 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {statusLabels[status] || status}
                          </span>
                        </div>

                        {skillsList.length > 0 && (
                          <div className="mb-4 flex flex-wrap gap-2">
                            {skillsList.map((skill) => (
                              <span
                                key={skill}
                                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 animate-scale-in"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {applicant.resumeUrl && (
                            <a
                              href={sanitizeMediaUrl(applicant.resumeUrl)}
                              target="_blank"
                              rel="noreferrer"
                              className="flex h-9 items-center rounded-lg border border-gray-300 px-3 text-sm font-medium hover:bg-gray-50 text-slate-900"
                            >
                              <FileText className="mr-2 h-3 w-3" />
                              View Resume
                            </a>
                          )}
                          {status === 'pending' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(applicant.id, 'shortlisted')}
                                className="flex h-9 items-center rounded-lg bg-slate-900 px-3 text-sm font-semibold text-white hover:bg-slate-800"
                              >
                                <UserCheck className="mr-2 h-3 w-3" />
                                Shortlist
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(applicant.id, 'interviewed')}
                                className="flex h-9 items-center rounded-lg border border-gray-300 px-3 text-sm font-medium hover:bg-gray-50 text-slate-900"
                              >
                                <Calendar className="mr-2 h-3 w-3" />
                                Schedule Interview
                              </button>
                            </>
                          )}
                          {status === 'shortlisted' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(applicant.id, 'interviewed')}
                              className="flex h-9 items-center rounded-lg bg-slate-900 px-3 text-sm font-semibold text-white hover:bg-slate-800"
                            >
                              <Calendar className="mr-2 h-3 w-3" />
                              Interview Seeker
                            </button>
                          )}
                          {status !== 'rejected' && status !== 'withdrawn' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(applicant.id, 'rejected')}
                              className="flex h-9 items-center rounded-lg border border-gray-300 px-3 text-sm font-medium text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="mr-2 h-3 w-3" />
                              Reject
                            </button>
                          )}
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
    </div>
  );
}

export default CompanyApplicantsContent;
