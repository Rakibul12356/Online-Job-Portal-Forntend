import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Plus, Send, X } from 'lucide-react';
import { ROUTES } from '@/constants';

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900';

const defaultSkills = ['JavaScript', 'React', 'Node.js', 'MongoDB', 'AWS'];

export function CreateJobContent() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState(defaultSkills);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({
    jobTitle: '',
    jobType: '',
    workMode: '',
    category: '',
    experience: '',
    city: '',
    salaryMin: '',
    salaryMax: '',
    salaryPeriod: 'yearly',
    description: '',
    requirements: '',
    benefits: '',
    vacancies: '1',
    deadline: '',
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
    navigate(ROUTES.DASHBOARD);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <nav className="mb-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link to={ROUTES.DASHBOARD} className="hover:text-slate-900">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900">Create Job</span>
        </nav>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Post a New Job</h1>
            <p className="text-gray-500">
              Fill in the details to create a new job posting
            </p>
          </div>
          <Link
            to={ROUTES.DASHBOARD}
            className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Link>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Basic Information</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="jobTitle" className="mb-2 block text-sm font-medium">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                id="jobTitle"
                type="text"
                value={form.jobTitle}
                onChange={(e) => updateField('jobTitle', e.target.value)}
                className={inputClass}
                placeholder="e.g. Senior Full Stack Developer"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="jobType" className="mb-2 block text-sm font-medium">
                  Job Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="jobType"
                  value={form.jobType}
                  onChange={(e) => updateField('jobType', e.target.value)}
                  className={inputClass}
                  required
                >
                  <option value="">Select job type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div>
                <label htmlFor="workMode" className="mb-2 block text-sm font-medium">
                  Work Mode <span className="text-red-500">*</span>
                </label>
                <select
                  id="workMode"
                  value={form.workMode}
                  onChange={(e) => updateField('workMode', e.target.value)}
                  className={inputClass}
                  required
                >
                  <option value="">Select work mode</option>
                  <option value="on-site">On-site</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="category" className="mb-2 block text-sm font-medium">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className={inputClass}
                  required
                >
                  <option value="">Select category</option>
                  <option value="engineering">Engineering</option>
                  <option value="design">Design</option>
                  <option value="product">Product</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                  <option value="hr">Human Resources</option>
                  <option value="finance">Finance</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="experience" className="mb-2 block text-sm font-medium">
                  Experience Level <span className="text-red-500">*</span>
                </label>
                <select
                  id="experience"
                  value={form.experience}
                  onChange={(e) => updateField('experience', e.target.value)}
                  className={inputClass}
                  required
                >
                  <option value="">Select experience level</option>
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (2-5 years)</option>
                  <option value="senior">Senior Level (5-10 years)</option>
                  <option value="lead">Lead (10+ years)</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Location & Compensation</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label htmlFor="city" className="mb-2 block text-sm font-medium">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                id="city"
                type="text"
                value={form.city}
                onChange={(e) => updateField('city', e.target.value)}
                className={inputClass}
                placeholder="e.g. San Francisco"
                required
              />
            </div>
            <div>
              <label htmlFor="salaryMin" className="mb-2 block text-sm font-medium">
                Minimum Salary ($)
              </label>
              <input
                id="salaryMin"
                type="number"
                value={form.salaryMin}
                onChange={(e) => updateField('salaryMin', e.target.value)}
                className={inputClass}
                placeholder="e.g. 100000"
              />
            </div>
            <div>
              <label htmlFor="salaryMax" className="mb-2 block text-sm font-medium">
                Maximum Salary ($)
              </label>
              <input
                id="salaryMax"
                type="number"
                value={form.salaryMax}
                onChange={(e) => updateField('salaryMax', e.target.value)}
                className={inputClass}
                placeholder="e.g. 150000"
              />
            </div>
            <div>
              <label htmlFor="salaryPeriod" className="mb-2 block text-sm font-medium">
                Salary Period
              </label>
              <select
                id="salaryPeriod"
                value={form.salaryPeriod}
                onChange={(e) => updateField('salaryPeriod', e.target.value)}
                className={inputClass}
              >
                <option value="yearly">Yearly</option>
                <option value="monthly">Monthly</option>
                <option value="hourly">Hourly</option>
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Job Description</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-medium">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={8}
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                className={`${inputClass} resize-none`}
                placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                required
              />
              <p className="mt-2 text-xs text-gray-500">
                Provide a detailed description of the role and responsibilities
              </p>
            </div>
            <div>
              <label htmlFor="requirements" className="mb-2 block text-sm font-medium">
                Requirements & Qualifications
              </label>
              <textarea
                id="requirements"
                rows={6}
                value={form.requirements}
                onChange={(e) => updateField('requirements', e.target.value)}
                className={`${inputClass} resize-none`}
                placeholder="List the required skills, qualifications, and experience..."
              />
            </div>
            <div>
              <label htmlFor="benefits" className="mb-2 block text-sm font-medium">
                Benefits & Perks
              </label>
              <textarea
                id="benefits"
                rows={5}
                value={form.benefits}
                onChange={(e) => updateField('benefits', e.target.value)}
                className={`${inputClass} resize-none`}
                placeholder="Describe the benefits, perks, and what makes your company a great place to work..."
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Required Skills</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="skillInput" className="mb-2 block text-sm font-medium">
                Add Skills <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  id="skillInput"
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  className={`${inputClass} flex-1`}
                  placeholder="Type a skill and press Add"
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
              <p className="mt-2 text-xs text-gray-500">
                Add technical and soft skills required for this position
              </p>
            </div>
            <div>
              <p className="mb-3 text-sm font-medium">Added Skills</p>
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
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Application Settings</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="vacancies" className="mb-2 block text-sm font-medium">
                Number of Vacancies
              </label>
              <input
                id="vacancies"
                type="number"
                min={1}
                value={form.vacancies}
                onChange={(e) => updateField('vacancies', e.target.value)}
                className={inputClass}
                placeholder="e.g. 2"
              />
            </div>
            <div>
              <label htmlFor="deadline" className="mb-2 block text-sm font-medium">
                Application Deadline <span className="text-red-500">*</span>
              </label>
              <input
                id="deadline"
                type="date"
                value={form.deadline}
                onChange={(e) => updateField('deadline', e.target.value)}
                className={inputClass}
                required
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-end gap-3 sm:flex-row">
            <Link
              to={ROUTES.DASHBOARD}
              className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <Send className="mr-2 h-4 w-4" />
              Publish Job
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}

export default CreateJobContent;
