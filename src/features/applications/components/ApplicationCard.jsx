import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Clock,
  DollarSign,
  Eye,
  MapPin,
  X,
  MessageSquare,
} from 'lucide-react';
import { ROUTES } from '@/constants';
import { chatService } from '@/services';
import { formatDate } from '@/utils';


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

export function ApplicationCard({ application, onWithdraw, isWithdrawing }) {
  const navigate = useNavigate();
  const [chatLoading, setChatLoading] = useState(false);

  const handleChatWithEmployer = async () => {
    setChatLoading(true);
    try {
      const response = await chatService.getOrCreateRoom(application.jobId);
      if (response.success && response.data) {
        navigate(`${ROUTES.CHAT}?room=${response.data.id}`);
      }
    } catch (err) {
      console.error('Failed to start chat with employer:', err);
    } finally {
      setChatLoading(false);
    }
  };

  const Icon = application.icon || Briefcase;
  const title = application.jobTitle || application.title || 'Job Position';
  const company = application.company;
  const status = application.status;
  const badgeStyle = statusBadgeStyles[status] || 'bg-gray-100 text-gray-800';
  const statusLabel = statusLabels[status] || status;
  const appliedOn = application.appliedAt
    ? `Applied on ${formatDate(application.appliedAt)}`
    : application.appliedOn || 'N/A';
  
  const showWithdraw = status === 'pending' || status === 'shortlisted';

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${
        application.faded || status === 'withdrawn' ? 'opacity-75' : ''
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
                  {title}
                </Link>
              </h3>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-medium text-gray-700">{company}</span>
              </p>
            </div>
            {status && (
              <span
                className={`self-start rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeStyle}`}
              >
                {statusLabel}
              </span>
            )}
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            {application.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {application.location}
              </span>
            )}
            {application.jobType && (
              <span className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                {application.jobType}
              </span>
            )}
            {application.salary && (
              <span className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {application.salary}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              {appliedOn}
            </span>
            <div className="flex items-center gap-2">
              <Link
                to={ROUTES.JOB_DETAIL.replace(':jobId', application.jobId)}
                className="flex h-9 items-center rounded-lg border border-gray-300 px-3 text-sm font-medium transition-colors hover:bg-gray-50"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Job
              </Link>
              {status !== 'withdrawn' && (
                <button
                  type="button"
                  disabled={chatLoading}
                  onClick={handleChatWithEmployer}
                  className="flex h-9 items-center rounded-lg border border-gray-300 px-3 text-sm font-medium transition-colors hover:bg-gray-50 text-slate-800 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {chatLoading ? (
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border border-slate-500 border-t-transparent" />
                  ) : (
                    <MessageSquare className="mr-2 h-4 w-4" />
                  )}
                  Chat
                </button>
              )}
              {showWithdraw && (
                <button
                  type="button"
                  disabled={isWithdrawing}
                  onClick={() => onWithdraw?.(application.id)}
                  className="flex h-9 items-center rounded-lg border border-gray-300 px-3 text-sm font-medium transition-colors hover:bg-gray-50 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isWithdrawing ? (
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border border-red-600 border-t-transparent" />
                  ) : (
                    <X className="mr-2 h-4 w-4" />
                  )}
                  {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
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

