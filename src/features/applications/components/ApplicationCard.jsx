import { Link } from 'react-router-dom';
import {
  Briefcase,
  Clock,
  DollarSign,
  Eye,
  MapPin,
  X,
} from 'lucide-react';
import { ROUTES } from '@/constants';
import { statusStyles } from '../data/mockApplications';

export function ApplicationCard({ application }) {
  const Icon = application.icon;

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${
        application.faded ? 'opacity-75' : ''
      }`}
    >
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="shrink-0">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100">
            <Icon className="h-8 w-8 text-slate-900" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <h3 className="mb-1 text-lg font-semibold">
                <Link
                  to={ROUTES.JOB_DETAIL.replace(':jobId', application.jobId)}
                  className="hover:text-slate-900"
                >
                  {application.title}
                </Link>
              </h3>
              <p className="mb-2 text-sm text-gray-500">
                <Link
                  to={ROUTES.COMPANIES}
                  className="hover:text-slate-900"
                >
                  {application.company}
                </Link>
              </p>
            </div>
            {application.status && (
              <span
                className={`self-start rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  statusStyles[application.statusKey]
                }`}
              >
                {application.status}
              </span>
            )}
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {application.location}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              {application.jobType}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              {application.salary}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              {application.appliedOn}
            </span>
            <div className="flex items-center gap-2">
              <Link
                to={ROUTES.JOB_DETAIL.replace(':jobId', application.jobId)}
                className="flex h-9 items-center rounded-lg border border-gray-300 px-3 text-sm font-medium transition-colors hover:bg-gray-50"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Job
              </Link>
              {application.showWithdraw && (
                <button
                  type="button"
                  className="flex h-9 items-center rounded-lg border border-gray-300 px-3 text-sm font-medium transition-colors hover:bg-gray-50"
                >
                  <X className="mr-2 h-4 w-4" />
                  Withdraw
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationCard;
