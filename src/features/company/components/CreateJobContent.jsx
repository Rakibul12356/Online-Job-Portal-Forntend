import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Plus, Send, X } from 'lucide-react';
import { ROUTES } from '@/constants';
import { employerService } from '@/services';
import { LoadingSpinner } from '@/components';

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900';

const defaultSkills = ['JavaScript', 'React', 'Node.js', 'MongoDB', 'AWS'];

export function CreateJobContent() {
  const navigate = useNavigate();
  const editJobId = new URLSearchParams(window.location.search).get('edit');

  const [skills, setSkills] = useState(defaultSkills);
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (editJobId) {
      async function loadJob() {
        setLoading(true);
        setError(null);
        try {
          const response = await employerService.getJobDetails(editJobId);
          if (response.success && response.data) {
            const job = response.data;
            setForm({
              jobTitle: job.title || '',
              jobType: job.jobType || '',
              workMode: job.workMode || '',
              category: job.category || '',
              experience: job.experience || '',
              city: job.city || '',
              salaryMin: job.salaryMin || '',
              salaryMax: job.salaryMax || '',
              salaryPeriod: job.salaryPeriod || 'yearly',
              description: job.description || '',
              requirements: job.requirements || '',
              benefits: job.benefits || '',
              vacancies: String(job.vacancies || 1),
              deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
            });
            if (job.skills) {
              setSkills(job.skills);
            }
          } else {
            setError('Failed to load job details');
          }
        } catch (err) {
          console.error(err);
          setError(err.message || 'Error loading job details');
        } finally {
          setLoading(false);
        }
      }
      loadJob();
    }
  }, [editJobId]);

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
    setError(null);

    const payload = {
      title: form.jobTitle,
      jobType: form.jobType,
      workMode: form.workMode,
      category: form.category,
      experience: form.experience,
      city: form.city,
      salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
      salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
      salaryPeriod: form.salaryPeriod,
      description: form.description,
      requirements: form.requirements,
      benefits: form.benefits,
      vacancies: Number(form.vacancies) || 1,
      deadline: form.deadline ? new Date(form.deadline).toISOString() : undefined,
      skills,
    };

    try {
      let result;
      if (editJobId) {
        result = await employerService.updateJob(editJobId, payload);
      } else {
        result = await employerService.createJob(payload);
      }

      if (result.success) {
        alert(editJobId ? 'Job updated successfully!' : 'Job posted successfully!');
        navigate(ROUTES.MANAGE_JOBS);
      } else {
        setError(result.message || 'Failed to submit job posting');
      }
    } catch (err) {
      console.error('Error submitting job:', err);
      setError(err.message || 'Error occurred while saving job post');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <nav className="mb-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link to={ROUTES.DASHBOARD} className="hover:text-slate-900">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to={ROUTES.MANAGE_JOBS} className="hover:text-slate-900">
            Manage Jobs
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900">{editJobId ? 'Edit Job' : 'Post Job'}</span>
        </nav>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">{editJobId ? 'Edit Job Posting' : 'Post a New Job'}</h1>
            <p className="text-gray-500">
              {editJobId ? 'Update the details of your job listing' : 'Fill in the details to create a new job posting'}
            </p>
          </div>
          <Link
            to={ROUTES.MANAGE_JOBS}
            className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50 text-slate-950"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600" role="alert">
          {error}
        </div>
      )}

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
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  <option value="">Select Job Type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
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
                  <option value="">Select Work Mode</option>
                  <option value="on-site">On-site</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className="mb-2 block text-sm font-medium">
                  Category <span className="text-red-500">*</span>
                </label>
                <input
                  id="category"
                  type="text"
                  placeholder="e.g. Software Engineering"
                  value={form.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className={inputClass}
                  required
                />
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
                  <option value="">Select Experience Level</option>
                  <option value="entry-level">Entry-level</option>
                  <option value="mid-level">Mid-level</option>
                  <option value="senior-level">Senior-level</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="city" className="mb-2 block text-sm font-medium">
                  Location (City) <span className="text-red-500">*</span>
                </label>
                <input
                  id="city"
                  type="text"
                  placeholder="e.g. San Francisco, CA"
                  value={form.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label htmlFor="vacancies" className="mb-2 block text-sm font-medium">
                  Number of Vacancies
                </label>
                <input
                  id="vacancies"
                  type="number"
                  min="1"
                  value={form.vacancies}
                  onChange={(e) => updateField('vacancies', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Salary Range</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="salaryMin" className="mb-2 block text-sm font-medium">
                Minimum Salary
              </label>
              <input
                id="salaryMin"
                type="number"
                placeholder="e.g. 50000"
                value={form.salaryMin}
                onChange={(e) => updateField('salaryMin', e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="salaryMax" className="mb-2 block text-sm font-medium">
                Maximum Salary
              </label>
              <input
                id="salaryMax"
                type="number"
                placeholder="e.g. 80000"
                value={form.salaryMax}
                onChange={(e) => updateField('salaryMax', e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="salaryPeriod" className="mb-2 block text-sm font-medium">
                Period
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
          <h2 className="mb-6 text-xl font-semibold">Job Details</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-medium">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={5}
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                className={`${inputClass} resize-none`}
                placeholder="Provide a general overview of the role..."
                required
              />
            </div>

            <div>
              <label htmlFor="requirements" className="mb-2 block text-sm font-medium">
                Requirements <span className="text-red-500">*</span>
              </label>
              <textarea
                id="requirements"
                rows={5}
                value={form.requirements}
                onChange={(e) => updateField('requirements', e.target.value)}
                className={`${inputClass} resize-none`}
                placeholder="List skills, educational requirements, or certifications..."
                required
              />
            </div>

            <div>
              <label htmlFor="benefits" className="mb-2 block text-sm font-medium">
                Benefits
              </label>
              <textarea
                id="benefits"
                rows={4}
                value={form.benefits}
                onChange={(e) => updateField('benefits', e.target.value)}
                className={`${inputClass} resize-none`}
                placeholder="List healthcare, equity, or work-life benefits..."
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Required Skills & Deadline</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="skillInput" className="mb-2 block text-sm font-medium">
                Skills tags (Press Enter to add)
              </label>
              <div className="flex gap-2">
                <input
                  id="skillInput"
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  className={inputClass}
                  placeholder="e.g. React"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="rounded-full p-0.5 hover:bg-slate-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
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
              to={ROUTES.MANAGE_JOBS}
              className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50 text-slate-950"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              <Send className="mr-2 h-4 w-4" />
              {saving ? 'Submitting...' : editJobId ? 'Update Job' : 'Publish Job'}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}

export default CreateJobContent;
