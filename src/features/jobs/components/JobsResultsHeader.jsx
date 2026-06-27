import { useState } from 'react';
import { mockJobs, sortOptions } from '../data/mockJobs';
import { SortDropdown } from './SortDropdown';

export function JobsResultsHeader({ total = mockJobs.length }) {
  const [sortBy, setSortBy] = useState('Most Recent');
  const [sortOpen, setSortOpen] = useState(false);

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-semibold">Available Jobs</h2>
        <p className="mt-1 text-sm text-gray-500">
          Showing {total.toLocaleString()} results
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Sort by:</span>
        <SortDropdown
          value={sortBy}
          options={sortOptions}
          onChange={setSortBy}
          isOpen={sortOpen}
          onToggle={() => setSortOpen((open) => !open)}
        />
      </div>
    </div>
  );
}

export default JobsResultsHeader;
