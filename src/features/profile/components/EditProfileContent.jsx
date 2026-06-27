import { useState } from 'react';
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
import { profileData } from '../data/mockProfile';

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900';

export function EditProfileContent({ user }) {
  const navigate = useNavigate();
  const [skills, setSkills] = useState(profileData.skills);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({
    name: user?.name ?? 'John Doe',
    email: user?.email ?? profileData.contact.email,
    phone: profileData.contact.phone,
    title: profileData.title,
    city: 'San Francisco',
    state: 'California',
    country: 'United States',
    zipcode: '94102',
    bio: profileData.about,
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    portfolio: 'https://johndoe.dev',
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

  function handleSubmit(event) {
    event.preventDefault();
    navigate(ROUTES.PROFILE);
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
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-100">
                <User className="h-16 w-16 text-slate-900" />
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-slate-900 transition-colors hover:bg-slate-800"
              >
                <Camera className="h-5 w-5 text-white" />
              </button>
            </div>
            <div className="flex-1">
              <h3 className="mb-2 font-medium">Upload Profile Picture</h3>
              <p className="mb-4 text-sm text-gray-500">
                JPG, PNG or GIF. Max size of 5MB.
              </p>
              <div className="flex flex-wrap gap-2">
                <label className="flex cursor-pointer items-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photo
                  <input type="file" className="hidden" accept="image/*" />
                </label>
                <button
                  type="button"
                  className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </button>
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
            {profileData.experience.map((exp) => (
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
                    <input type="month" defaultValue="2022-01" className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">End Date</label>
                    <input
                      type="month"
                      defaultValue={exp.id === '2' ? '2021-12' : ''}
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
              <h3 className="font-medium">{profileData.education.degree}</h3>
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
                  defaultValue={profileData.education.school}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Degree</label>
                <input
                  type="text"
                  defaultValue="Bachelor of Science"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Start Year</label>
                <input type="number" defaultValue={2016} className={inputClass} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">End Year</label>
                <input type="number" defaultValue={2020} className={inputClass} />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Resume/CV</h2>
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
                    {profileData.resume.updatedAt} • 245 KB
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
              className="flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}

export default EditProfileContent;
