import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';

export function SimilarJobs({ jobs }) {
  if (!jobs.length) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Similar Jobs</h2>
      <div className="space-y-4">
        {jobs.map((job) => {
          const Icon = job.icon;
          return (
            <article
              key={job.id}
              className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
            >
              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                    <Icon className="h-6 w-6 text-slate-900" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 font-semibold">
                    <Link
                      to={ROUTES.JOB_DETAIL.replace(':jobId', job.id)}
                      className="hover:underline"
                    >
                      {job.title}
                    </Link>
                  </h3>
                  <p className="mb-2 text-sm text-gray-500">
                    {job.company} • {job.location} • {job.workMode}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900">
                      {job.salary}
                    </span>
                    <Link
                      to={ROUTES.JOB_DETAIL.replace(':jobId', job.id)}
                      className="text-sm text-slate-900 hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default SimilarJobs;
