import { Link } from 'react-router-dom';
import { Clock, MapPin, Users } from 'lucide-react';
import { ROUTES } from '@/constants';

export function JobCard({ job, onApply }) {
  const Icon = job.icon;

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="shrink-0">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100">
            <Icon className="h-8 w-8 text-slate-900" />
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="mb-1 text-lg font-semibold">
                <Link
                  to={ROUTES.JOB_DETAIL.replace(':jobId', job.id)}
                  className="hover:underline"
                >
                  {job.title}
                </Link>
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                <Link
                  to={ROUTES.COMPANIES}
                  className="font-medium hover:text-slate-900"
                >
                  {job.company}
                </Link>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {job.postedAt}
                </span>
              </div>
            </div>
          </div>

          <p className="line-clamp-2 text-sm text-gray-500">{job.description}</p>

          <div className="flex flex-wrap gap-2">
            {job.tags.map((tag, index) => (
              <span
                key={tag}
                className={
                  index === 0
                    ? 'rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-900'
                    : 'rounded-full border border-gray-300 px-2.5 py-0.5 text-xs font-medium text-gray-700'
                }
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-slate-900">
                {job.salary}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Users className="h-4 w-4" />
                {job.applicants} applicants
              </span>
            </div>
            <div className="flex gap-2">
              <Link
                to={ROUTES.JOB_DETAIL.replace(':jobId', job.id)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
              >
                View Details
              </Link>
              <button
                type="button"
                onClick={() => onApply?.(job)}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default JobCard;
