import { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export function FilterDropdown({
  label,
  options,
  selected = [],
  onChange,
  isOpen,
  onToggle,
}) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        if (isOpen) onToggle();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  function toggleOption(option) {
    const next = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option];
    onChange(next);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex h-8 items-center rounded-lg border border-gray-300 bg-white px-3 text-xs font-medium text-gray-900 transition-colors hover:bg-gray-50"
      >
        {label}
        <ChevronDown className="ml-2 h-3 w-3" />
      </button>

      {isOpen && (
        <div className="absolute left-0 z-20 mt-1 min-w-[180px] rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
          <div className="space-y-1">
            {options.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => toggleOption(option)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterDropdown;
