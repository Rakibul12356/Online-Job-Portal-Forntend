import { useState } from 'react';
import { Search } from 'lucide-react';
import { filterOptions } from '../data/mockJobs';
import { FilterDropdown } from './FilterDropdown';

const filterKeys = ['jobType', 'experienceLevel', 'salaryRange', 'skills'];

const filterLabels = {
  jobType: 'Job Type',
  experienceLevel: 'Experience Level',
  salaryRange: 'Salary Range',
  skills: 'Skills',
};

export function JobSearchSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    jobType: [],
    experienceLevel: [],
    salaryRange: [],
    skills: [],
  });
  const [openDropdown, setOpenDropdown] = useState(null);

  function toggleDropdown(key) {
    setOpenDropdown((current) => (current === key ? null : key));
  }

  function updateFilter(key, values) {
    setFilters((prev) => ({ ...prev, [key]: values }));
  }

  function clearAllFilters() {
    setFilters({
      jobType: [],
      experienceLevel: [],
      salaryRange: [],
      skills: [],
    });
    setSearchQuery('');
  }

  return (
    <section className="mb-8">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1 rounded-md ring ring-transparent transition-all focus-within:ring-slate-900">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jobs by title, skill..."
                  className="w-full rounded-md border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              <Search className="h-4 w-4" />
              Search Jobs
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-gray-200 pt-2">
            <span className="mr-2 text-sm font-medium text-gray-500">
              Filters:
            </span>

            {filterKeys.map((key) => (
              <FilterDropdown
                key={key}
                label={filterLabels[key]}
                options={filterOptions[key]}
                selected={filters[key]}
                onChange={(values) => updateFilter(key, values)}
                isOpen={openDropdown === key}
                onToggle={() => toggleDropdown(key)}
              />
            ))}

            <button
              type="button"
              onClick={clearAllFilters}
              className="h-8 rounded-lg px-3 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default JobSearchSection;
