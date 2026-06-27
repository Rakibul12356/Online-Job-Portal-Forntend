import { Building2, User } from 'lucide-react';

export function AccountTypeToggle({ accountType, onChange }) {
  return (
    <div className="mb-8 w-full text-center">
      <div className="mx-auto inline-flex w-full max-w-md rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
        <div className="grid w-full grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChange('job-seeker')}
            className={`flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
              accountType === 'job-seeker'
                ? 'bg-slate-900 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <User className="mr-2 h-4 w-4" />
            Job Seeker
          </button>
          <button
            type="button"
            onClick={() => onChange('employer')}
            className={`flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
              accountType === 'employer'
                ? 'bg-slate-900 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Building2 className="mr-2 h-4 w-4" />
            Employer
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountTypeToggle;
