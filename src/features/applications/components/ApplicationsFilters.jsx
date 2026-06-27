import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { dateFilters, statusFilters } from '../data/mockApplications';

export function ApplicationsFilters({ onReset }) {
  const [selectedStatus, setSelectedStatus] = useState(['all']);
  const [selectedDate, setSelectedDate] = useState('all');

  function toggleStatus(id) {
    if (id === 'all') {
      setSelectedStatus(['all']);
      return;
    }

    setSelectedStatus((prev) => {
      const withoutAll = prev.filter((item) => item !== 'all');
      if (withoutAll.includes(id)) {
        const next = withoutAll.filter((item) => item !== id);
        return next.length ? next : ['all'];
      }
      return [...withoutAll, id];
    });
  }

  function handleReset() {
    setSelectedStatus(['all']);
    setSelectedDate('all');
    onReset?.();
  }

  return (
    <aside className="lg:col-span-1">
      <div className="sticky top-20 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold">Filters</h2>

        <div className="mb-6">
          <h3 className="mb-3 text-sm font-medium">Application Status</h3>
          <div className="space-y-2">
            {statusFilters.map(({ id, label, count }) => (
              <label
                key={id}
                className="flex cursor-pointer items-center gap-2"
              >
                <input
                  type="checkbox"
                  checked={selectedStatus.includes(id)}
                  onChange={() => toggleStatus(id)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">{label}</span>
                <span className="ml-auto text-xs text-gray-500">{count}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-3 text-sm font-medium">Application Date</h3>
          <div className="space-y-2">
            {dateFilters.map(({ id, label }) => (
              <label
                key={id}
                className="flex cursor-pointer items-center gap-2"
              >
                <input
                  type="radio"
                  name="date"
                  checked={selectedDate === id}
                  onChange={() => setSelectedDate(id)}
                  className="border-gray-300"
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Filters
        </button>
      </div>
    </aside>
  );
}

export default ApplicationsFilters;
