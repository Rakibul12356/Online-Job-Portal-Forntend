import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ROUTES } from '@/constants';
import { seekerService } from '@/services';
import { ApplicationsFilters } from './ApplicationsFilters';
import { ApplicationCard } from './ApplicationCard';
import { LoadingSpinner } from '@/components';

const sortOptions = ['Newest First', 'Oldest First'];

export function ApplicationsContent() {
  const [sortBy, setSortBy] = useState('Newest First');
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const [selectedStatus, setSelectedStatus] = useState(['all']);
  const [selectedDate, setSelectedDate] = useState('all');

  const loadApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};

      if (selectedStatus.length > 0 && !selectedStatus.includes('all')) {
        params.status = selectedStatus[0];
      }

      if (selectedDate !== 'all') {
        params.date = selectedDate;
      }

      params.sort = sortBy === 'Newest First' ? 'newest' : 'oldest';

      const response = await seekerService.getApplications(params);
      if (response.success && response.data) {
        setApplications(response.data.items || []);
        setTotal(
          response.data.pagination?.total ??
            response.data.items?.length ??
            0,
        );
      } else {
        setError('Failed to fetch applications');
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err.message || 'Error occurred while loading applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [selectedStatus, selectedDate, sortBy]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    try {
      const response = await seekerService.withdrawApplication(appId);
      if (response.success) {
        alert('Application withdrawn successfully!');
        setApplications((prev) =>
          prev.map((app) => (app.id === appId ? { ...app, status: 'withdrawn' } : app))
        );
      }
    } catch (err) {
      alert(err.message || 'Failed to withdraw application');
    }
  };

  return (
    <>
      <div className="mb-8">
        <nav className="mb-2 flex items-center gap-2 text-sm text-gray-500">
          <Link
            to={ROUTES.DASHBOARD}
            className="transition-colors hover:text-slate-900"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900">Applied Jobs</span>
        </nav>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Applied Jobs</h1>
            <p className="text-gray-500">
              Track all your job applications in one place
            </p>
          </div>
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-900">{total}</span> applications
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <ApplicationsFilters
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onFilterChange={(statuses, dateVal) => {
            setSelectedStatus(statuses);
            setSelectedDate(dateVal);
          }}
          onReset={() => {
            setSelectedStatus(['all']);
            setSelectedDate('all');
          }}
        />

        <div className="space-y-4 lg:col-span-3">
          <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <div ref={sortRef} className="relative">
                <button
                  type="button"
                  onClick={() => setSortOpen((open) => !open)}
                  className="flex h-9 items-center rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium transition-colors hover:bg-gray-50"
                >
                  {sortBy}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </button>
                {sortOpen && (
                  <div className="absolute left-0 z-10 mt-2 w-48 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
                    {sortOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setSortBy(option);
                          setSortOpen(false);
                        }}
                        className="w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-center text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : applications.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
              <p className="text-gray-500 font-medium">No applications found matching the filter criteria.</p>
            </div>
          ) : (
            applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onWithdraw={handleWithdraw}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default ApplicationsContent;
