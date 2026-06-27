import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Calendar,
  ChevronRight,
  Eye,
  FileText,
  Loader2,
  Mail,
  UserCheck,
  XCircle,
} from 'lucide-react';
import { ROUTES } from '@/constants';
import {
  companyApplicants,
  dateFilterOptions,
  defaultDateFilter,
  defaultExperienceFilters,
  defaultStatusFilters,
  experienceFilterConfig,
  statusFilterConfig,
  statusStyles,
} from '../data/mockCompanyApplicants';

const statusMap = {
  new: 'New',
  shortlisted: 'Shortlisted',
  interviewed: 'Interviewed',
  rejected: 'Rejected',
};

function getMaxHours(dateFilter) {
  return dateFilterOptions.find((option) => option.id === dateFilter)?.maxHours ?? Infinity;
}

export function CompanyApplicantsContent() {
  const [statusFilters, setStatusFilters] = useState(defaultStatusFilters);
  const [experienceFilters, setExperienceFilters] = useState(defaultExperienceFilters);
  const [dateFilter, setDateFilter] = useState(defaultDateFilter);

  const filteredApplicants = useMemo(() => {
    const activeStatuses = Object.entries(statusFilters)
      .filter(([, enabled]) => enabled)
      .map(([key]) => statusMap[key]);

    const activeExperience = Object.entries(experienceFilters)
      .filter(([, enabled]) => enabled)
      .map(([key]) => key);

    const maxHours = getMaxHours(dateFilter);

    return companyApplicants.filter((applicant) => {
      const statusMatch =
        activeStatuses.length === 0 || activeStatuses.includes(applicant.status);
      const experienceMatch =
        activeExperience.length === 0 ||
        activeExperience.includes(applicant.experienceLevel);
      const dateMatch = applicant.appliedHoursAgo <= maxHours;

      return statusMatch && experienceMatch && dateMatch;
    });
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
                {statusFilterConfig.map(({ id, label, count }) => (
                  <label
                    key={id}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={statusFilters[id]}
                      onChange={() => toggleStatusFilter(id)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{label}</span>
                    <span className="ml-auto text-xs text-gray-500">({count})</span>
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
                      checked={experienceFilters[id]}
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
          <div className="space-y-4">
            {filteredApplicants.map((applicant) => (
              <article
                key={applicant.id}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col gap-6 md:flex-row">
                  <div className="shrink-0">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${applicant.avatarGradient} text-xl font-bold text-white`}
                    >
                      {applicant.initials}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="mb-1 text-lg font-semibold">{applicant.name}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {applicant.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {applicant.experience}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {applicant.appliedAt}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          statusStyles[applicant.statusVariant]
                        }`}
                      >
                        {applicant.status}
                      </span>
                    </div>

                    <div className="mb-4 flex flex-wrap gap-2">
                      {applicant.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="flex h-9 items-center rounded-lg border border-gray-300 px-3 text-sm font-medium hover:bg-gray-50"
                      >
                        <Eye className="mr-2 h-3 w-3" />
                        View Profile
                      </button>
                      <button
                        type="button"
                        className="flex h-9 items-center rounded-lg border border-gray-300 px-3 text-sm font-medium hover:bg-gray-50"
                      >
                        <FileText className="mr-2 h-3 w-3" />
                        Resume
                      </button>
                      {applicant.showShortlist && (
                        <button
                          type="button"
                          className="flex h-9 items-center rounded-lg bg-slate-900 px-3 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                          <UserCheck className="mr-2 h-3 w-3" />
                          Shortlist
                        </button>
                      )}
                      <button
                        type="button"
                        className="flex h-9 items-center rounded-lg border border-gray-300 px-3 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="mr-2 h-3 w-3" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {filteredApplicants.length === 0 && (
              <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
                <p className="text-gray-500">No applicants match your filters.</p>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
            >
              <Loader2 className="mr-2 h-4 w-4" />
              Load More Applicants
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyApplicantsContent;
