import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Calendar,
  ChevronRight,
  Eye,
  FileText,
  Mail,
  UserCheck,
  XCircle,
  MessageSquare,
  X,
} from 'lucide-react';
import { ROUTES } from '@/constants';
import { employerService, chatService } from '@/services';
import { LoadingSpinner } from '@/components';
import { sanitizeMediaUrl } from '@/config/env';
import { useToast } from '@/context';
import { formatDate, showConfirmDialog } from '@/utils';

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
  const toast = useToast();
  const navigate = useNavigate();
  const [statusFilters, setStatusFilters] = useState(defaultStatusFilters);
  const [experienceFilters, setExperienceFilters] = useState(
    defaultExperienceFilters,
  );
  const [dateFilter, setDateFilter] = useState(defaultDateFilter);

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingAction, setUpdatingAction] = useState({
    id: null,
    status: null,
  });
  const [chatLoadingId, setChatLoadingId] = useState(null);
  const [schedulingApplicant, setSchedulingApplicant] = useState(null);

  const handleScheduleInterview = async (
    appId,
    { interviewDate, interviewTime, notes },
  ) => {
    setUpdatingAction({ id: appId, status: 'interviewed' });
    setSchedulingApplicant(null);

    // Optimistically update candidate status in local state
    setApplicants((curr) =>
      curr.map((item) =>
        item.id === appId ? { ...item, status: 'interviewed' } : item,
      ),
    );

    try {
      const response = await employerService.updateApplicantStatus(
        appId,
        'interviewed',
        {
          interviewDate,
          interviewTime,
          notes,
        },
      );
      if (response.success) {
        toast.success('Interview scheduled successfully!');
        fetchApplicants();
      } else {
        toast.error(response.message || 'Failed to schedule interview');
        fetchApplicants();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to schedule interview');
      fetchApplicants();
    } finally {
      setUpdatingAction({ id: null, status: null });
    }
  };

  const handleChatWithCandidate = async (applicant) => {
    const jobId = applicant.jobId || (applicant.job && applicant.job.id) || '1';
    const seekerId = applicant.seekerId || applicant.userId || applicant.id;

    setChatLoadingId(applicant.id);
    try {
      const response = await chatService.getOrCreateRoom(jobId, seekerId);
      if (response.success && response.data) {
        navigate(`${ROUTES.CHAT}?room=${response.data.id}`);
      }
    } catch (err) {
      console.error('Failed to start chat with candidate:', err);
      toast.error('Could not initiate chat with candidate.');
    } finally {
      setChatLoadingId(null);
    }
  };

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
    const confirmed = await showConfirmDialog({
      title: 'Update Candidate Status?',
      text: `Are you sure you want to mark this candidate as "${statusVal}"?`,
      confirmButtonText: `Yes, Mark as ${statusVal}`,
      icon: statusVal === 'rejected' ? 'warning' : 'question',
      isDanger: statusVal === 'rejected',
    });
    if (!confirmed) return;

    setUpdatingAction({ id: appId, status: statusVal });
    // Optimistically update candidate status in local state
    setApplicants((curr) =>
      curr.map((item) =>
        item.id === appId ? { ...item, status: statusVal } : item,
      ),
    );

    try {
      const response = await employerService.updateApplicantStatus(
        appId,
        statusVal,
      );
      if (response.success) {
        toast.success(`Candidate marked as ${statusVal}!`);
        fetchApplicants();
      } else {
        toast.error(response.message || 'Failed to update applicant status');
        fetchApplicants();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update applicant status');
      fetchApplicants();
    } finally {
      setUpdatingAction({ id: null, status: null });
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
              <p className="text-gray-500 font-medium">
                No candidates match your filters.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {applicants.map((applicant) => {
                const name =
                  applicant.seekerName || applicant.name || 'Candidate';
                const email = applicant.seekerEmail || applicant.email || '';
                const skillsList =
                  applicant.seekerSkills || applicant.skills || [];
                const experience =
                  applicant.seekerExperience || applicant.experience || 'N/A';
                const dateApplied = applicant.appliedAt
                  ? formatDate(applicant.appliedAt)
                  : 'N/A';
                const status = applicant.status;

                return (
                  <article
                    key={applicant.id}
                    className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md animate-fade-in"
                  >
                    <div className="flex flex-col gap-6 md:flex-row">
                      <div className="shrink-0">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-xl font-bold text-white">
                          {name.substring(0, 2).toUpperCase()}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                          <div>
                            <h3 className="mb-1 text-lg font-semibold">
                              {name}
                            </h3>
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
                              Applied for:{' '}
                              <span className="text-slate-900">
                                {applicant.jobTitle || 'N/A'}
                              </span>
                            </p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                              statusStyles[status] ||
                              'bg-gray-100 text-gray-800'
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

                        {status === 'interviewed' &&
                          applicant.interviewDate && (
                            <div className="mb-4 rounded-lg bg-blue-50 border border-blue-100 p-4 animate-fade-in">
                              <h4 className="mb-2 text-sm font-semibold text-blue-900 flex items-center gap-1.5">
                                <Calendar className="h-4 w-4 text-blue-700" />
                                Interview Details
                              </h4>
                              <div className="text-xs text-blue-800 space-y-1">
                                <p>
                                  <strong>Date:</strong>{' '}
                                  {formatDate(applicant.interviewDate)}
                                </p>
                                <p>
                                  <strong>Time:</strong>{' '}
                                  {applicant.interviewTime}
                                </p>
                                {applicant.interviewNotes && (
                                  <p className="mt-2 text-gray-700 bg-white/60 p-2.5 rounded border border-blue-200/50 break-words">
                                    <strong>Instructions / Notes:</strong>{' '}
                                    {applicant.interviewNotes}
                                  </p>
                                )}
                              </div>
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
                          <button
                            type="button"
                            disabled={chatLoadingId !== null}
                            onClick={() => handleChatWithCandidate(applicant)}
                            className="flex h-9 items-center rounded-lg border border-gray-300 px-3 text-sm font-medium hover:bg-gray-50 text-slate-900 disabled:opacity-50"
                          >
                            {chatLoadingId === applicant.id ? (
                              <span className="mr-2 h-3 w-3 animate-spin rounded-full border border-slate-900 border-t-transparent" />
                            ) : (
                              <MessageSquare className="mr-2 h-3 w-3" />
                            )}
                            Chat
                          </button>
                          {status === 'pending' && (
                            <>
                              <button
                                type="button"
                                disabled={updatingAction.id !== null}
                                onClick={() =>
                                  handleUpdateStatus(
                                    applicant.id,
                                    'shortlisted',
                                  )
                                }
                                className="flex h-9 items-center rounded-lg bg-slate-900 px-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-800/80 disabled:cursor-not-allowed"
                              >
                                {updatingAction.id === applicant.id &&
                                updatingAction.status === 'shortlisted' ? (
                                  <span className="mr-2 h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                                ) : (
                                  <UserCheck className="mr-2 h-3 w-3" />
                                )}
                                Shortlist
                              </button>
                              <button
                                type="button"
                                disabled={updatingAction.id !== null}
                                onClick={() =>
                                  setSchedulingApplicant(applicant)
                                }
                                className="flex h-9 items-center rounded-lg border border-gray-300 px-3 text-sm font-medium hover:bg-gray-50 text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Calendar className="mr-2 h-3 w-3" />
                                Schedule Interview
                              </button>
                            </>
                          )}
                          {status === 'shortlisted' && (
                            <button
                              type="button"
                              disabled={updatingAction.id !== null}
                              onClick={() => setSchedulingApplicant(applicant)}
                              className="flex h-9 items-center rounded-lg bg-slate-900 px-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-800/80 disabled:cursor-not-allowed"
                            >
                              <Calendar className="mr-2 h-3 w-3" />
                              Interview Seeker
                            </button>
                          )}
                          {status !== 'rejected' && status !== 'withdrawn' && (
                            <button
                              type="button"
                              disabled={updatingAction.id !== null}
                              onClick={() =>
                                handleUpdateStatus(applicant.id, 'rejected')
                              }
                              className="flex h-9 items-center rounded-lg border border-gray-300 px-3 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {updatingAction.id === applicant.id &&
                              updatingAction.status === 'rejected' ? (
                                <span className="mr-2 h-3 w-3 animate-spin rounded-full border border-red-600 border-t-transparent" />
                              ) : (
                                <XCircle className="mr-2 h-3 w-3" />
                              )}
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

      {schedulingApplicant && (
        <ScheduleInterviewModal
          applicant={schedulingApplicant}
          onClose={() => setSchedulingApplicant(null)}
          onSchedule={handleScheduleInterview}
        />
      )}
    </div>
  );
}

function ScheduleInterviewModal({ applicant, onClose, onSchedule }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const name = applicant.seekerName || applicant.name || 'Candidate';
  const jobTitle =
    applicant.jobTitle ||
    (applicant.job && applicant.job.title) ||
    'the position';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !time) {
      setError('Please select both date and time.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onSchedule(applicant.id, {
        interviewDate: date,
        interviewTime: time,
        notes,
      });
    } catch (err) {
      setError(err.message || 'Failed to schedule interview.');
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-white';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-dialog-title"
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2
                id="schedule-dialog-title"
                className="text-xl font-bold text-gray-900"
              >
                Schedule Interview
              </h2>
              <p className="mt-1.5 text-sm text-gray-500">
                Invite{' '}
                <span className="font-semibold text-slate-800">{name}</span> to
                interview for{' '}
                <span className="font-semibold text-slate-800">{jobTitle}</span>
                .
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-55/10 hover:text-gray-700 transition-colors"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <p
              className="rounded-lg bg-rose-50 px-3 py-2.5 text-sm text-rose-600 font-medium"
              role="alert"
            >
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="interview-date"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Interview Date
              </label>
              <input
                id="interview-date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label
                htmlFor="interview-time"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Interview Time
              </label>
              <input
                id="interview-time"
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="interview-notes"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Notes / Instructions (Optional)
              </label>
              <textarea
                id="interview-notes"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g., Google Meet link, interview format, location, or dress code instructions..."
                className={inputClass}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 items-center justify-center rounded-lg border border-gray-300 px-4 text-sm font-medium hover:bg-gray-50 text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 transition-colors disabled:bg-slate-800/80 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <span className="mr-2 h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Scheduling...
                  </>
                ) : (
                  'Schedule'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CompanyApplicantsContent;
