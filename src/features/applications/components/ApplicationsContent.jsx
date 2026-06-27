import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { ROUTES } from '@/constants';
import {
  appliedJobs,
  sortOptions,
} from '../data/mockApplications';
import { ApplicationsFilters } from './ApplicationsFilters';
import { ApplicationCard } from './ApplicationCard';

export function ApplicationsContent() {
  const [sortBy, setSortBy] = useState('Newest First');
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
            <span className="font-medium text-gray-900">12</span> applications
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <ApplicationsFilters />

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

          {appliedJobs.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}

          <div className="flex justify-center pt-6">
            <button
              type="button"
              className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
            >
              <Loader2 className="mr-2 h-4 w-4" />
              Load More Applications
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ApplicationsContent;
