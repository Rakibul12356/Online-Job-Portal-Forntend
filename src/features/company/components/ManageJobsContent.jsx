import { useEffect, useRef, useState } from 'react';
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
  XCircle,
} from 'lucide-react';
import { ROUTES } from '@/constants';
import { employerService } from '@/services';
import { LoadingSpinner } from '@/components';

const statusFilterOptions = ['All Status', 'Active', 'Draft', 'Closed'];
const sortOptions = ['Newest First', 'Oldest First'];

const statusStyles = {
  active: 'bg-green-100 text-green-800 border-green-200',
  draft: 'bg-gray-100 text-gray-800 border-gray-200',
  closed: 'bg-red-100 text-red-800 border-red-200',
};

const statusLabels = {
  active: 'Active',
  draft: 'Draft',
  closed: 'Closed',
};

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
        className="flex h-10 items-center rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-900 hover:bg-gray-50 animate-fade-in"
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

export function ManageJobsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [sortBy, setSortBy] = useState('Newest First');
  const [selectedIds, setSelectedIds] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 10,
        sort: sortBy === 'Newest First' ? 'newest' : 'oldest',
      };

      if (searchQuery.trim()) {
        params.q = searchQuery;
      }

      if (statusFilter !== 'All Status') {
        params.status = statusFilter.toLowerCase();
      }

      const response = await employerService.getOwnedJobs(params);
      if (response.success && response.data) {
        setJobs(response.data.items || []);
        setTotal(response.data.pagination?.total || response.data.items?.length || 0);
      } else {
        setError('Failed to fetch jobs listing');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error occurred while loading jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchQuery, statusFilter, sortBy, page]);

  const allSelected = jobs.length > 0 && selectedIds.length === jobs.length;

  function toggleDropdown(key) {
    setOpenDropdown((current) => (current === key ? null : key));
  }

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(jobs.map((job) => job.id));
    }
  }

  function toggleSelect(id) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  const handlePublish = async (id) => {
    try {
      const response = await employerService.publishJob(id);
      if (response.success) {
        alert('Job published successfully!');
        fetchJobs();
      }
    } catch (err) {
      alert(err.message || 'Failed to publish job');
    }
  };

  const handleClose = async (id) => {
    if (!window.confirm('Are you sure you want to close this job posting?')) return;
    try {
      const response = await employerService.closeJob(id);
      if (response.success) {
        alert('Job closed successfully!');
        fetchJobs();
      }
    } catch (err) {
      alert(err.message || 'Failed to close job');
    }
  };

  const handleReactivate = async (id) => {
    try {
      const response = await employerService.reactivateJob(id);
      if (response.success) {
        alert('Job reactivated successfully!');
        fetchJobs();
      }
    } catch (err) {
      alert(err.message || 'Failed to reactivate job');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      const response = await employerService.deleteJob(id);
      if (response.success) {
        alert('Job deleted successfully!');
        setSelectedIds((curr) => curr.filter((val) => val !== id));
        fetchJobs();
      }
    } catch (err) {
      alert(err.message || 'Failed to delete job');
    }
  };

  const handleBulkAction = async (action) => {
    if (!window.confirm(`Perform bulk ${action} action on ${selectedIds.length} jobs?`)) return;
    try {
      const response = await employerService.bulkJobsAction(selectedIds, action);
      if (response.success) {
        alert('Bulk action executed successfully!');
        setSelectedIds([]);
        fetchJobs();
      }
    } catch (err) {
      alert(err.message || 'Bulk action failed');
    }
  };

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
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
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
              onChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
            />
            <FilterDropdown
              label="Sort"
              icon={ArrowUpDown}
              value={sortBy === 'Newest First' ? 'Sort' : sortBy}
              options={sortOptions}
              isOpen={openDropdown === 'sort'}
              onToggle={() => toggleDropdown('sort')}
              onChange={(val) => {
                setSortBy(val);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-center text-sm text-red-600">
          {error}
        </div>
      )}

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
                <th className="px-6 py-4 text-left text-sm font-medium">Deadline</th>
                <th className="px-6 py-4 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <LoadingSpinner />
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-sm text-gray-500 font-medium">
                    No job posts found.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => {
                  const isClosed = job.status === 'closed';
                  const isDraft = job.status === 'draft';
                  return (
                    <tr
                      key={job.id}
                      className={`transition-colors hover:bg-gray-50 ${
                        isClosed ? 'opacity-60' : ''
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
                        <div className="min-w-[200px]">
                          <Link
                            to={ROUTES.JOB_DETAIL.replace(':jobId', job.id)}
                            className="font-medium hover:text-slate-700"
                          >
                            {job.title}
                          </Link>
                          <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                            {job.city && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {job.city}
                              </span>
                            )}
                            {job.jobType && (
                              <span className="flex items-center gap-1">
                                <Briefcase className="h-3 w-3" />
                                {job.jobType}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                            statusStyles[job.status] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {statusLabels[job.status] || job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium">{job.applicants ?? 0}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {job.postedAt ? new Date(job.postedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`${ROUTES.CREATE_JOB}?edit=${job.id}`}
                            title="Edit"
                            className="rounded p-2 text-gray-600 hover:bg-gray-100 block"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          {isDraft && (
                            <button
                              type="button"
                              onClick={() => handlePublish(job.id)}
                              title="Publish"
                              className="rounded p-2 text-green-600 hover:bg-green-50"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          {!isClosed && !isDraft && (
                            <button
                              type="button"
                              onClick={() => handleClose(job.id)}
                              title="Close Job"
                              className="rounded p-2 text-amber-600 hover:bg-amber-50"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                          {isClosed && (
                            <button
                              type="button"
                              onClick={() => handleReactivate(job.id)}
                              title="Reactivate"
                              className="rounded p-2 text-green-600 hover:bg-green-50"
                            >
                              <PlayCircle className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDelete(job.id)}
                            title="Delete"
                            className="rounded p-2 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
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
                  onClick={() => handleBulkAction('deactivate')}
                  className="flex h-9 items-center rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium hover:bg-gray-50 text-slate-900"
                >
                  <PauseCircle className="mr-2 h-3 w-3" />
                  Deactivate
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkAction('activate')}
                  className="flex h-9 items-center rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium hover:bg-gray-50 text-slate-900"
                >
                  <PlayCircle className="mr-2 h-3 w-3" />
                  Activate
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkAction('delete')}
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
              Total of <span className="font-medium">{total}</span> jobs posted
            </p>
            {total > 10 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="flex h-9 items-center rounded-lg border border-gray-300 px-3 text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium">Page {page}</span>
                <button
                  type="button"
                  disabled={jobs.length < 10}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex h-9 items-center rounded-lg border border-gray-300 px-3 text-sm hover:bg-gray-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageJobsContent;
