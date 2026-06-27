import {
  Calendar,
  Flag,
  Globe,
  Link2,
  MapPin,
  Send,
  Share2,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';

export function JobDetailSidebar({ job, onApply }) {
  const Icon = job.icon;
  const { companyInfo } = job;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4 text-center">
            <p className="mb-1 text-2xl font-bold text-slate-900">{job.salary}</p>
            <p className="text-sm text-gray-500">Per year</p>
          </div>

          <button
            type="button"
            onClick={() => onApply(job)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-slate-800"
          >
            <Send className="h-4 w-4" />
            Apply Now
          </button>

          <div className="space-y-3 border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Applicants</span>
              <span className="font-medium">{job.applicants}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Posted</span>
              <span className="font-medium">{job.postedLabel}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">About Company</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-100">
              <Icon className="h-8 w-8 text-slate-900" />
            </div>
            <div>
              <h4 className="font-semibold">{job.company}</h4>
              <p className="text-sm text-gray-500">{companyInfo.industry}</p>
            </div>
          </div>

          <p className="text-sm text-gray-500">{companyInfo.about}</p>

          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-gray-500" />
              <a href="#" className="text-slate-900 hover:underline">
                {companyInfo.website}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-gray-500">{companyInfo.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-gray-500">{companyInfo.employees}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-500">{companyInfo.founded}</span>
            </div>
          </div>

          <Link
            to={ROUTES.COMPANIES}
            className="mt-4 flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
          >
            View Company Profile
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Share this Job</h3>
        <div className="flex gap-2">
          {['LinkedIn', 'Twitter', 'Facebook'].map((label) => (
            <button
              key={label}
              type="button"
              title={`Share on ${label}`}
              className="flex flex-1 items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 transition-colors hover:bg-gray-50"
            >
              <Share2 className="h-4 w-4" />
            </button>
          ))}
          <button
            type="button"
            title="Copy link"
            className="flex flex-1 items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 transition-colors hover:bg-gray-50"
          >
            <Link2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900"
      >
        <Flag className="h-4 w-4" />
        Report this job
      </button>
    </div>
  );
}

export default JobDetailSidebar;
