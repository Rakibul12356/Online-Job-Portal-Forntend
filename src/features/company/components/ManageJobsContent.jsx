import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpDown,
  Briefcase,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit,
  Filter,
  MapPin,
  PauseCircle,
  PlayCircle,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { ROUTES } from '@/constants';
import {
  manageJobs,
  sortOptions,
  statusFilterOptions,
  statusStyles,
} from '../data/mockManageJobs';

function FilterDropdown({ label, icon: Icon, value, options, isOpen, onToggle, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target) && isOpen) {
        onToggle();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex h-10 items-center rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
      >
        <Icon className="mr-2 h-4 w-4" />
        {value || label}
        <ChevronDown className="ml-2 h-4 w-4" />
      </button>
      {isOpen && (
        <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                onToggle();
              }}
              className="w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function parsePostedDate(dateStr) {
  return new Date(dateStr).getTime();
}

export function ManageJobsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [sortBy, setSortBy] = useState('Newest First');
  const [selectedIds, setSelectedIds] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  const filteredJobs = useMemo(() => {
    let jobs = [...manageJobs];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      jobs = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== 'All Status') {
      jobs = jobs.filter((job) => job.status === statusFilter);
    }

    jobs.sort((a, b) => {
      const dateA = parsePostedDate(a.postedDate);
      const dateB = parsePostedDate(b.postedDate);
      return sortBy === 'Newest First' ? dateB - dateA : dateA - dateB;
    });

    return jobs;
  }, [searchQuery, statusFilter, sortBy]);

  const allSelected =
    filteredJobs.length > 0 && selectedIds.length === filteredJobs.length;

  function toggleDropdown(key) {
    setOpenDropdown((current) => (current === key ? null : key));
  }

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds([]);
      return;
    }
    setSelectedIds(filteredJobs.map((job) => job.id));
  }

  function toggleSelect(id) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  return (
    <div>
      <div className="mb-8">
        <nav className="mb-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link to={ROUTES.DASHBOARD} className="hover:text-slate-900">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900">Manage Jobs</span>
        </nav>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Manage Jobs</h1>
            <p className="text-gray-500">View and manage all your job postings</p>
          </div>
          <Link
            to={ROUTES.CREATE_JOB}
            className="flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Job
          </Link>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs by title, location..."
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>
          <div className="flex gap-2">
            <FilterDropdown
              label="Status"
              icon={Filter}
              value={statusFilter === 'All Status' ? 'Status' : statusFilter}
              options={statusFilterOptions}
              isOpen={openDropdown === 'status'}
              onToggle={() => toggleDropdown('status')}
              onChange={setStatusFilter}
            />
            <FilterDropdown
              label="Sort"
              icon={ArrowUpDown}
              value={sortBy === 'Newest First' ? 'Sort' : sortBy}
              options={sortOptions}
              isOpen={openDropdown === 'sort'}
              onToggle={() => toggleDropdown('sort')}
              onChange={setSortBy}
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium">Job Title</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Applicants</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Posted Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Expires</th>
                <th className="px-6 py-4 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredJobs.map((job) => (
                <tr
                  key={job.id}
                  className={`transition-colors hover:bg-gray-50 ${
                    job.isClosed ? 'opacity-60' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(job.id)}
                      onChange={() => toggleSelect(job.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <Link
                        to={ROUTES.JOB_DETAIL.replace(':jobId', job.jobId)}
                        className="font-medium hover:text-slate-700"
                      >
                        {job.title}
                      </Link>
                      <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {job.type}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        statusStyles[job.statusVariant]
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {job.applicants != null ? (
                      <span className="font-medium">{job.applicants}</span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{job.postedDate}</td>
                  <td
                    className={`px-6 py-4 text-sm ${
                      job.expiresHighlight
                        ? 'font-medium text-yellow-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {job.expiresDate}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {!job.isClosed && (
                        <button
                          type="button"
                          title="Edit"
                          className="rounded p-2 text-gray-600 hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      {job.isDraft && (
                        <button
                          type="button"
                          title="Publish"
                          className="rounded p-2 text-green-600 hover:bg-green-50"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      {job.isClosed && (
                        <button
                          type="button"
                          title="Reactivate"
                          className="rounded p-2 text-green-600 hover:bg-green-50"
                        >
                          <PlayCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        title="Delete"
                        className="rounded p-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedIds.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm font-medium">
                {selectedIds.length} jobs selected
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="flex h-9 items-center rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium hover:bg-gray-50"
                >
                  <PauseCircle className="mr-2 h-3 w-3" />
                  Deactivate
                </button>
                <button
                  type="button"
                  className="flex h-9 items-center rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium hover:bg-gray-50"
                >
                  <PlayCircle className="mr-2 h-3 w-3" />
                  Activate
                </button>
                <button
                  type="button"
                  className="flex h-9 items-center rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="mr-2 h-3 w-3" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to{' '}
              <span className="font-medium">{filteredJobs.length}</span> of{' '}
              <span className="font-medium">24</span> jobs
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled
                className="flex h-9 items-center rounded-lg border border-gray-300 px-3 text-sm disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {[1, 2, 3, 4].map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`flex h-9 items-center rounded-lg px-3 text-sm font-medium ${
                    page === 1
                      ? 'bg-slate-900 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                className="flex h-9 items-center rounded-lg border border-gray-300 px-3 text-sm hover:bg-gray-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageJobsContent;
