import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Camera,
  ChevronRight,
  Code,
  FileText,
  Globe,
  Link2,
  Plus,
  Save,
  Trash2,
  Upload,
  User,
  X,
} from 'lucide-react';
import { ROUTES } from '@/constants';
import { seekerService } from '@/services';
import { sanitizeMediaUrl } from '@/config/env';
import { useToast } from '@/context';
import { formatDate } from '@/utils';


const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900';

export function EditProfileContent({ user, profile }) {
  const navigate = useNavigate();
  const toast = useToast();
  const avatarInputRef = useRef(null);
  const [skills, setSkills] = useState(profile?.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [removingAvatar, setRemovingAvatar] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: profile?.name || user?.name || '',
    email: profile?.email || user?.email || '',
    phone: profile?.phone || '',
    title: profile?.title || '',
    city: profile?.location?.city || '',
    state: profile?.location?.state || '',
    country: profile?.location?.country || '',
    zipcode: profile?.location?.zipcode || '',
    bio: profile?.bio || '',
    linkedin: profile?.social?.linkedin || '',
    github: profile?.social?.github || '',
    portfolio: profile?.social?.portfolio || '',
  });

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addSkill() {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
      setSkillInput('');
    }
  }

  function removeSkill(skill) {
    setSkills((prev) => prev.filter((item) => item !== skill));
  }

  function handleSkillKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addSkill();
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        title: form.title,
        city: form.city,
        state: form.state,
        country: form.country,
        zipcode: form.zipcode,
        bio: form.bio,
        skills,
        linkedin: form.linkedin,
        github: form.github,
        portfolio: form.portfolio,
      };

      const result = await seekerService.updateProfile(payload);
      if (result.success) {
        toast.success('Profile updated successfully!');
        navigate(ROUTES.PROFILE);
      } else {
        const msg = result.message || 'Failed to update profile';
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      const msg = err.message || 'Error occurred while saving profile';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <nav className="mb-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link to={ROUTES.DASHBOARD} className="hover:text-slate-900">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to={ROUTES.PROFILE} className="hover:text-slate-900">
            My Profile
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900">Edit Profile</span>
        </nav>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Edit Profile</h1>
            <p className="text-gray-500">
              Update your personal information and preferences
            </p>
          </div>
          <Link
            to={ROUTES.PROFILE}
            className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Link>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Profile Photo</h2>
          <div className="flex flex-col items-center gap-6 md:flex-row">
            <div className="relative shrink-0">
              <input
                ref={avatarInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                disabled={uploadingAvatar || removingAvatar}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploadingAvatar(true);
                  try {
                    const response = await seekerService.uploadAvatar(file);
                    if (response.success) {
                      toast.success('Avatar uploaded successfully!');
                      setTimeout(() => window.location.reload(), 1000);
                    }
                  } catch (err) {
                    toast.error(err.message || 'Failed to upload avatar');
                    setUploadingAvatar(false);
                  }
                }}
              />
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-gray-100 border border-gray-200">
                {profile?.avatarUrl ? (
                  <img
                    src={sanitizeMediaUrl(profile.avatarUrl)}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-16 w-16 text-slate-900" />
                )}
              </div>
              <button
                type="button"
                disabled={uploadingAvatar || removingAvatar}
                onClick={() => avatarInputRef.current?.click()}
                className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-slate-900 transition-transform hover:scale-105 cursor-pointer disabled:opacity-50"
                title="Upload Photo"
              >
                {uploadingAvatar ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Camera className="h-5 w-5 text-white" />
                )}
              </button>
            </div>
            <div className="flex-1">
              <h3 className="mb-2 font-medium">Upload Profile Picture</h3>
              <p className="mb-4 text-sm text-gray-500">
                JPG, PNG or GIF. Max size of 5MB.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={uploadingAvatar || removingAvatar}
                  onClick={() => avatarInputRef.current?.click()}
                  className="flex cursor-pointer items-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:bg-slate-800/80 disabled:cursor-not-allowed"
                >
                  {uploadingAvatar ? (
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  {uploadingAvatar ? 'Uploading...' : 'Upload Photo'}
                </button>
                {profile?.avatarUrl && (
                  <button
                    type="button"
                    disabled={uploadingAvatar || removingAvatar}
                    onClick={async () => {
                      if (!window.confirm('Remove profile photo?')) return;
                      setRemovingAvatar(true);
                      try {
                        const response = await seekerService.deleteAvatar();
                        if (response.success) {
                          toast.success('Photo removed!');
                          setTimeout(() => window.location.reload(), 1000);
                        }
                      } catch (err) {
                        toast.error(err.message || 'Failed to remove photo');
                        setRemovingAvatar(false);
                      }
                    }}
                    className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {removingAvatar ? (
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    {removingAvatar ? 'Removing...' : 'Remove'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Basic Information</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              { id: 'name', label: 'Name', type: 'text', required: true },
              { id: 'email', label: 'Email Address', type: 'email', required: true },
              { id: 'phone', label: 'Phone Number', type: 'tel', required: true },
              { id: 'title', label: 'Professional Title', type: 'text' },
            ].map(({ id, label, type, required }) => (
              <div key={id}>
                <label htmlFor={id} className="mb-2 block text-sm font-medium">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                  id={id}
                  type={type}
                  value={form[id]}
                  onChange={(e) => updateField(id, e.target.value)}
                  className={inputClass}
                  required={required}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Location</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              { id: 'city', label: 'City', required: true },
              { id: 'state', label: 'State/Province', required: true },
              { id: 'country', label: 'Country', required: true },
              { id: 'zipcode', label: 'Zip Code' },
            ].map(({ id, label, required }) => (
              <div key={id}>
                <label htmlFor={id} className="mb-2 block text-sm font-medium">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                  id={id}
                  type="text"
                  value={form[id]}
                  onChange={(e) => updateField(id, e.target.value)}
                  className={inputClass}
                  required={required}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">About</h2>
          <label htmlFor="bio" className="mb-2 block text-sm font-medium">
            Professional Summary
          </label>
          <textarea
            id="bio"
            rows={5}
            value={form.bio}
            onChange={(e) => updateField('bio', e.target.value)}
            className={`${inputClass} resize-none`}
            placeholder="Write a brief summary about yourself..."
          />
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Skills</h2>
          <div className="mb-4">
            <label htmlFor="skillInput" className="mb-2 block text-sm font-medium">
              Add Skills
            </label>
            <div className="flex gap-2">
              <input
                id="skillInput"
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                className={`${inputClass} flex-1`}
                placeholder="Type a skill and press Enter"
              />
              <button
                type="button"
                onClick={addSkill}
                className="flex items-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add
              </button>
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm font-medium">Current Skills</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Work Experience</h2>
            <button
              type="button"
              className="flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Experience
            </button>
          </div>
          <div className="space-y-6">
            {(profile?.experience || []).map((exp) => (
              <div
                key={exp.id}
                className="rounded-lg border border-gray-200 p-4"
              >
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="font-medium">{exp.title}</h3>
                  <button
                    type="button"
                    className="rounded p-1 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Company</label>
                    <input
                      type="text"
                      defaultValue={exp.company}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Employment Type
                    </label>
                    <input
                      type="text"
                      defaultValue={exp.type}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Start Date</label>
                    <input type="month" defaultValue={exp.startDate || "2022-01"} className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">End Date</label>
                    <input
                      type="month"
                      defaultValue={exp.endDate || ''}
                      placeholder="Present"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Education</h2>
            <button
              type="button"
              className="flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Education
            </button>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-4 flex items-start justify-between">
              <h3 className="font-medium">{(profile?.education?.[0]?.degree) || 'Degree'}</h3>
              <button
                type="button"
                className="rounded p-1 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Institution</label>
                <input
                  type="text"
                  defaultValue={(profile?.education?.[0]?.school) || ''}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Degree</label>
                <input
                  type="text"
                  defaultValue={(profile?.education?.[0]?.degree) || ''}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Start Year</label>
                <input type="number" defaultValue={(profile?.education?.[0]?.startDate ? parseInt(profile.education[0].startDate.substring(0, 4)) : 2016)} className={inputClass} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">End Year</label>
                <input type="number" defaultValue={(profile?.education?.[0]?.endDate ? parseInt(profile.education[0].endDate.substring(0, 4)) : 2020)} className={inputClass} />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Resume/CV</h2>
          <div className="space-y-4">
            {profile?.resume?.url && (
              <div className="rounded-lg bg-gray-100 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white">
                    <FileText className="h-6 w-6 text-slate-900" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {profile.resume.filename || 'resume.pdf'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Uploaded {profile.resume.uploadedAt ? formatDate(profile.resume.uploadedAt) : 'N/A'}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded p-2 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
            <label className="flex w-full cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50">
              <Upload className="mr-2 h-4 w-4" />
              Upload New Resume
              <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
            </label>
            <p className="text-xs text-gray-500">
              Supported formats: PDF, DOC, DOCX. Max size: 5MB
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Social Profiles</h2>
          <div className="space-y-4">
            {[
              { id: 'linkedin', label: 'LinkedIn', icon: Link2 },
              { id: 'github', label: 'GitHub', icon: Code },
              { id: 'portfolio', label: 'Portfolio Website', icon: Globe },
            ].map(({ id, label, icon: Icon }) => (
              <div key={id}>
                <label htmlFor={id} className="mb-2 flex items-center text-sm font-medium">
                  <Icon className="mr-1 h-4 w-4" />
                  {label}
                </label>
                <input
                  id={id}
                  type="url"
                  value={form[id]}
                  onChange={(e) => updateField(id, e.target.value)}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <div className="flex flex-col justify-end gap-3 sm:flex-row">
            <Link
              to={ROUTES.PROFILE}
              className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-800/80 disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}

export default EditProfileContent;
