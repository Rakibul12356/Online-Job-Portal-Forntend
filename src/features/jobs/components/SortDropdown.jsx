import { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export function SortDropdown({ value, options, onChange, isOpen, onToggle }) {
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

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex h-9 items-center rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
      >
        {value}
        <ChevronDown className="ml-2 h-3 w-3" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-20 mt-1 min-w-[200px] rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                onToggle();
              }}
              className="w-full rounded p-2 text-left text-sm hover:bg-gray-100"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SortDropdown;
