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
import { useToast } from '@/context';
import { formatDate, showConfirmDialog } from '@/utils';



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
  const toast = useToast();
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
  const [processingAction, setProcessingAction] = useState({ id: null, type: null });
  const [bulkProcessing, setBulkProcessing] = useState(false);

  const fetchJobs = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setError(null);
    try {
      const params = {
        page,
        limit: 10,
        sort: sortBy === 'Newest First' ? 'newest' : 'oldest',
      };

      if (searchQuery.trim()) {
        params.q = searchQuery.trim();
      }

      if (statusFilter !== 'All Status') {
        params.status = statusFilter.toLowerCase();
      }

      const response = await employerService.getOwnedJobs(params);
      if (response.success && response.data) {
        const rawItems = Array.isArray(response.data)
          ? response.data
          : response.data.items || response.data.jobs || response.data.data || [];

        const normalized = rawItems.map((job) => ({
          ...job,
          id: job.id || job._id,
        }));

        setJobs(normalized);
        setTotal(
          response.data.pagination?.total ??
          response.data.total ??
          normalized.length
        );
      } else {
        setError('Failed to fetch jobs listing');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error occurred while loading jobs');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchJobs(true);
  }, [searchQuery, statusFilter, sortBy, page]);

  const allSelected = jobs.length > 0 && selectedIds.length === jobs.length;

  function toggleDropdown(key) {
    setOpenDropdown((current) => (current === key ? null : key));
  }

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(jobs.map((job) => job.id || job._id));
    }
  }

  function toggleSelect(id) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  const handlePublish = async (id) => {
    setProcessingAction({ id, type: 'publish' });
    setJobs((curr) =>
      curr.map((val) => ((val.id || val._id) === id ? { ...val, status: 'active' } : val))
    );
    try {
      const response = await employerService.publishJob(id);
      if (response && response.success !== false) {
        toast.success(response.message || 'Job published successfully!');
        fetchJobs(false);
      } else {
        toast.error(response?.message || 'Failed to publish job');
        fetchJobs(false);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to publish job');
      fetchJobs(false);
    } finally {
      setProcessingAction({ id: null, type: null });
    }
  };

  const handleClose = async (id) => {
    const confirmed = await showConfirmDialog({
      title: 'Close Job Posting?',
      text: 'Are you sure you want to close this job posting? Candidates will no longer be able to apply.',
      confirmButtonText: 'Yes, Close Job',
      icon: 'warning',
      isDanger: true,
    });
    if (!confirmed) return;

    setProcessingAction({ id, type: 'close' });
    setJobs((curr) =>
      curr.map((val) => ((val.id || val._id) === id ? { ...val, status: 'closed' } : val))
    );
    try {
      const response = await employerService.closeJob(id);
      if (response && response.success !== false) {
        toast.success(response.message || 'Job closed successfully!');
        fetchJobs(false);
      } else {
        toast.error(response?.message || 'Failed to close job');
        fetchJobs(false);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to close job');
      fetchJobs(false);
    } finally {
      setProcessingAction({ id: null, type: null });
    }
  };

  const handleReactivate = async (id) => {
    setProcessingAction({ id, type: 'reactivate' });
    setJobs((curr) =>
      curr.map((val) => ((val.id || val._id) === id ? { ...val, status: 'active' } : val))
    );
    try {
      const response = await employerService.reactivateJob(id);
      if (response && response.success !== false) {
        toast.success(response.message || 'Job reactivated successfully!');
        fetchJobs(false);
      } else {
        toast.error(response?.message || 'Failed to reactivate job');
        fetchJobs(false);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to reactivate job');
      fetchJobs(false);
    } finally {
      setProcessingAction({ id: null, type: null });
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirmDialog({
      title: 'Delete Job Posting?',
      text: 'Are you sure you want to delete this job posting? This action cannot be undone.',
      confirmButtonText: 'Yes, Delete',
      icon: 'error',
      isDanger: true,
    });
    if (!confirmed) return;

    setProcessingAction({ id, type: 'delete' });
    // Instantly remove from local state
    setJobs((curr) => curr.filter((val) => (val.id || val._id) !== id));
    setTotal((curr) => Math.max(0, curr - 1));
    setSelectedIds((curr) => curr.filter((val) => val !== id));

    try {
      const response = await employerService.deleteJob(id);
      if (response && response.success !== false) {
        toast.success(response.message || 'Job deleted successfully!');
        fetchJobs(false);
      } else {
        toast.error(response?.message || 'Failed to delete job');
        fetchJobs(false);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete job');
      fetchJobs(false);
    } finally {
      setProcessingAction({ id: null, type: null });
    }
  };

  const handleBulkAction = async (action) => {
    const confirmed = await showConfirmDialog({
      title: 'Confirm Bulk Action',
      text: `Are you sure you want to perform "${action}" on ${selectedIds.length} selected jobs?`,
      confirmButtonText: `Yes, ${action}`,
      icon: action === 'delete' ? 'error' : 'question',
      isDanger: action === 'delete',
    });
    if (!confirmed) return;

    setBulkProcessing(true);
    if (action === 'delete') {
      setJobs((curr) => curr.filter((val) => !selectedIds.includes(val.id || val._id)));
      setTotal((curr) => Math.max(0, curr - selectedIds.length));
    } else if (action === 'close' || action === 'reactivate') {
      const newStatus = action === 'close' ? 'closed' : 'active';
      setJobs((curr) =>
        curr.map((val) =>
          selectedIds.includes(val.id || val._id) ? { ...val, status: newStatus } : val
        )
      );
    }

    try {
      const response = await employerService.bulkJobsAction(selectedIds, action);
      if (response && response.success !== false) {
        toast.success(response.message || `Bulk ${action} executed successfully!`);
        setSelectedIds([]);
        fetchJobs(false);
      } else {
        toast.error(response?.message || 'Bulk action failed');
        fetchJobs(false);
      }
    } catch (err) {
      toast.error(err.message || 'Bulk action failed');
      fetchJobs(false);
    } finally {
      setBulkProcessing(false);
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
                            {job.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {job.location}
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
                        {job.postedAt ? formatDate(job.postedAt) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {job.deadline ? formatDate(job.deadline) : 'N/A'}
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
                              disabled={processingAction.id !== null || bulkProcessing}
                              title="Publish"
                              className="rounded p-2 text-green-600 hover:bg-green-50 disabled:opacity-50"
                            >
                              {processingAction.id === job.id && processingAction.type === 'publish' ? (
                                <span className="h-4 w-4 block animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </button>
                          )}
                          {!isClosed && !isDraft && (
                            <button
                              type="button"
                              onClick={() => handleClose(job.id)}
                              disabled={processingAction.id !== null || bulkProcessing}
                              title="Close Job"
                              className="rounded p-2 text-amber-600 hover:bg-amber-50 disabled:opacity-50"
                            >
                              {processingAction.id === job.id && processingAction.type === 'close' ? (
                                <span className="h-4 w-4 block animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
                              ) : (
                                <XCircle className="h-4 w-4" />
                              )}
                            </button>
                          )}
                          {isClosed && (
                            <button
                              type="button"
                              onClick={() => handleReactivate(job.id)}
                              disabled={processingAction.id !== null || bulkProcessing}
                              title="Reactivate"
                              className="rounded p-2 text-green-600 hover:bg-green-50 disabled:opacity-50"
                            >
                              {processingAction.id === job.id && processingAction.type === 'reactivate' ? (
                                <span className="h-4 w-4 block animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                              ) : (
                                <PlayCircle className="h-4 w-4" />
                              )}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDelete(job.id)}
                            disabled={processingAction.id !== null || bulkProcessing}
                            title="Delete"
                            className="rounded p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            {processingAction.id === job.id && processingAction.type === 'delete' ? (
                              <span className="h-4 w-4 block animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
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
                  disabled={bulkProcessing || processingAction.id !== null}
                  className="flex h-9 items-center rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium hover:bg-gray-50 text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bulkProcessing ? (
                    <span className="mr-2 h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
                  ) : (
                    <PauseCircle className="mr-2 h-3 w-3" />
                  )}
                  Deactivate
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkAction('activate')}
                  disabled={bulkProcessing || processingAction.id !== null}
                  className="flex h-9 items-center rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium hover:bg-gray-50 text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bulkProcessing ? (
                    <span className="mr-2 h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
                  ) : (
                    <PlayCircle className="mr-2 h-3 w-3" />
                  )}
                  Activate
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkAction('delete')}
                  disabled={bulkProcessing || processingAction.id !== null}
                  className="flex h-9 items-center rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bulkProcessing ? (
                    <span className="mr-2 h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                  ) : (
                    <Trash2 className="mr-2 h-3 w-3" />
                  )}
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
