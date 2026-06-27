import { Link } from 'react-router-dom';
import { Bookmark, Clock, MapPin } from 'lucide-react';
import { ROUTES } from '@/constants';

export function JobDetailHeader({ job }) {
  const Icon = job.icon;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100">
            <Icon className="h-10 w-10 text-slate-900" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-start justify-between gap-4">
            <div>
              <h1 className="mb-2 text-3xl font-bold">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-gray-500">
                <Link
                  to={ROUTES.COMPANIES}
                  className="text-lg font-medium transition-colors hover:text-slate-900"
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
            <button
              type="button"
              className="shrink-0 rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
              title="Save job"
            >
              <Bookmark className="h-6 w-6" />
            </button>
          </div>
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
        </div>
      </div>
    </div>
  );
}

export default JobDetailHeader;
