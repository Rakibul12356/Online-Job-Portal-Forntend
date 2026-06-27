import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bookmark,
  Building,
  Building2,
  Clock,
  Code,
  Globe,
  Heart,
  Lightbulb,
  Link2,
  Mail,
  MapPin,
  Phone,
  Share2,
  Target,
  Users,
} from 'lucide-react';
import { ROUTES } from '@/constants';
import { companyProfileData } from '../data/mockCompanyProfile';

const valueIcons = {
  lightbulb: Lightbulb,
  users: Users,
  target: Target,
  heart: Heart,
};

const socialIcons = {
  linkedin: Link2,
  twitter: Share2,
  facebook: Share2,
  instagram: Share2,
  github: Code,
};

export function CompanyProfileContent({ user }) {
  const displayName = user?.name ?? companyProfileData.name;

  return (
    <>
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <div className="shrink-0">
            <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-gray-100">
              <Building2 className="h-16 w-16 text-slate-900" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold">{displayName}</h1>
                <div className="flex flex-wrap items-center gap-3 text-gray-500">
                  <span className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    {companyProfileData.industry}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {companyProfileData.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {companyProfileData.size}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">About Company</h2>
            <div className="space-y-4 text-gray-900">
              {companyProfileData.about.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Our Values</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {companyProfileData.values.map(({ id, title, description, icon }) => {
                const Icon = valueIcons[icon];
                return (
                  <div key={id} className="flex gap-3">
                    <div className="shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                        <Icon className="h-5 w-5 text-slate-900" />
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold">{title}</h3>
                      <p className="text-sm text-gray-500">{description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section
            id="jobs"
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Open Positions</h2>
              <span className="text-sm text-gray-500">
                {companyProfileData.jobsAvailable} jobs available
              </span>
            </div>
            <div className="space-y-4">
              {companyProfileData.openPositions.map((job) => (
                <article
                  key={job.id}
                  className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
                >
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="mb-1 text-lg font-semibold">
                        <Link
                          to={ROUTES.JOB_DETAIL.replace(':jobId', job.jobId)}
                          className="hover:underline"
                        >
                          {job.title}
                        </Link>
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.posted}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {job.applicants} applicants
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      title="Save job"
                      className="shrink-0 rounded p-2 hover:bg-gray-100"
                    >
                      <Bookmark className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="mb-3 text-sm text-gray-500">{job.description}</p>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {job.tags.map((tag, index) => (
                      <span
                        key={tag}
                        className={
                          index === 0
                            ? 'rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium'
                            : 'rounded-full border border-gray-300 px-2.5 py-0.5 text-xs font-medium text-gray-700'
                        }
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3 border-t border-gray-200 pt-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm font-semibold text-slate-900">
                      {job.salary}
                    </span>
                    <div className="flex gap-2">
                      <Link
                        to={ROUTES.JOB_DETAIL.replace(':jobId', job.jobId)}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
                      >
                        View Details
                      </Link>
                      <button
                        type="button"
                        className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link
                to={ROUTES.HOME}
                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
              >
                View All Open Positions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Globe className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
                <div>
                  <p className="mb-1 text-sm text-gray-500">Website</p>
                  <a
                    href={companyProfileData.contact.website}
                    className="text-sm font-medium text-slate-900 hover:underline"
                  >
                    {companyProfileData.contact.websiteLabel}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
                <div>
                  <p className="mb-1 text-sm text-gray-500">Email</p>
                  <a
                    href={`mailto:${companyProfileData.contact.email}`}
                    className="text-sm font-medium text-slate-900 hover:underline"
                  >
                    {companyProfileData.contact.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
                <div>
                  <p className="mb-1 text-sm text-gray-500">Phone</p>
                  <a
                    href={companyProfileData.contact.phoneHref}
                    className="text-sm font-medium"
                  >
                    {companyProfileData.contact.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
                <div>
                  <p className="mb-1 text-sm text-gray-500">Headquarters</p>
                  <p className="text-sm font-medium">
                    {companyProfileData.contact.address.map((line) => (
                      <span key={line}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Follow Us</h3>
            <div className="space-y-2">
              {companyProfileData.social.map(({ id, label, href }) => {
                const Icon = socialIcons[id] ?? Link2;
                return (
                  <a
                    key={id}
                    href={href}
                    className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-gray-100"
                  >
                    <Icon className="h-5 w-5 text-gray-500" />
                    <span className="text-sm font-medium">{label}</span>
                  </a>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default CompanyProfileContent;
