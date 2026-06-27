import { Link } from 'react-router-dom';
import {
  Bookmark,
  Calendar,
  Camera,
  Download,
  Edit,
  FileText,
  Code,
  Globe,
  GraduationCap,
  LayoutDashboard,
  Link2,
  Mail,
  MapPin,
  Phone,
  Upload,
  User,
} from 'lucide-react';
import { ROUTES } from '@/constants';
import { profileData } from '../data/mockProfile';

export function ProfileContent({ user }) {
  const displayName = user?.name ?? 'John Doe';
  const displayEmail = user?.email ?? profileData.contact.email;

  return (
    <>
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="relative shrink-0">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-100">
              <User className="h-16 w-16 text-slate-900" />
            </div>
            <div className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-slate-900">
              <Camera className="h-5 w-5 text-white" />
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-3 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold">{displayName}</h1>
                <p className="mb-2 text-lg text-gray-500">{profileData.title}</p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {profileData.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {profileData.memberSince}
                  </span>
                </div>
              </div>
              <Link
                to={ROUTES.EDIT_PROFILE}
                className="flex items-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-gray-200 pt-4">
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {profileData.stats.applications}
                </p>
                <p className="text-sm text-gray-500">Applications</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {profileData.stats.inReview}
                </p>
                <p className="text-sm text-gray-500">In Review</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {profileData.stats.savedJobs}
                </p>
                <p className="text-sm text-gray-500">Saved Jobs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">About</h2>
            <p className="leading-relaxed text-gray-900">{profileData.about}</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Contact Information</h2>
            <div className="space-y-4">
              {[
                { icon: Mail, label: 'Email', value: displayEmail },
                { icon: Phone, label: 'Phone', value: profileData.contact.phone },
                {
                  icon: MapPin,
                  label: 'Location',
                  value: profileData.contact.address,
                },
                {
                  icon: Link2,
                  label: 'LinkedIn',
                  value: profileData.contact.linkedin,
                  isLink: true,
                },
              ].map(({ icon: Icon, label, value, isLink }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                    <Icon className="h-5 w-5 text-slate-900" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{label}</p>
                    {isLink ? (
                      <a
                        href="#"
                        className="font-medium text-slate-900 hover:underline"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="font-medium">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-900"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Work Experience</h2>
            <div className="space-y-6">
              {profileData.experience.map((item) => (
                <div
                  key={item.id}
                  className="relative border-l-2 border-gray-200 pb-6 pl-8 last:pb-0"
                >
                  <div
                    className={`absolute -left-2 top-0 h-4 w-4 rounded-full border-2 border-white ${
                      item.current ? 'bg-slate-900' : 'bg-gray-200'
                    }`}
                  />
                  <h3 className="mb-1 font-semibold">{item.title}</h3>
                  <p className="mb-2 text-sm text-gray-500">
                    {item.company} • {item.type}
                  </p>
                  <p className="mb-3 text-xs text-gray-500">{item.period}</p>
                  <p className="text-sm text-gray-900">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Education</h2>
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                <GraduationCap className="h-6 w-6 text-slate-900" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold">
                  {profileData.education.degree}
                </h3>
                <p className="mb-1 text-sm text-gray-500">
                  {profileData.education.school}
                </p>
                <p className="text-xs text-gray-500">
                  {profileData.education.period}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Resume</h3>
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-100 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white">
                    <FileText className="h-6 w-6 text-slate-900" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {profileData.resume.filename}
                    </p>
                    <p className="text-xs text-gray-500">
                      {profileData.resume.updatedAt}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="flex h-9 w-full items-center justify-center rounded-lg border border-gray-300 bg-white text-xs font-medium transition-colors hover:bg-gray-50"
                >
                  <Download className="mr-2 h-3 w-3" />
                  Download
                </button>
              </div>
              <button
                type="button"
                className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
              >
                <Upload className="mr-2 h-4 w-4" />
                Update Resume
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Social Profiles</h3>
            <div className="space-y-2">
              {[
                { icon: Link2, label: 'LinkedIn' },
                { icon: Code, label: 'GitHub' },
                { icon: Globe, label: 'Portfolio' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-gray-100"
                >
                  <Icon className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium">{label}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                to={ROUTES.DASHBOARD}
                className="flex w-full items-center justify-start rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                View Dashboard
              </Link>
              <Link
                to={ROUTES.APPLICATIONS}
                className="flex w-full items-center justify-start rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
              >
                <FileText className="mr-2 h-4 w-4" />
                My Applications
              </Link>
              <Link
                to={ROUTES.SAVED_JOBS}
                className="flex w-full items-center justify-start rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
              >
                <Bookmark className="mr-2 h-4 w-4" />
                Saved Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileContent;
