import { useState } from 'react';
import { Building2, UserPlus } from 'lucide-react';
import { AccountTypeToggle } from './components/AccountTypeToggle';
import {
  EmployerHighlights,
  EmployerRegisterForm,
} from './components/EmployerRegisterForm';
import {
  JobSeekerHighlights,
  JobSeekerRegisterForm,
} from './components/JobSeekerRegisterForm';

export function RegisterPage() {
  const [accountType, setAccountType] = useState('job-seeker');
  const isEmployer = accountType === 'employer';

  return (
    <div className={`mx-auto ${isEmployer ? 'max-w-3xl' : 'max-w-2xl'}`}>
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-900/10">
          {isEmployer ? (
            <Building2 className="h-8 w-8 text-slate-900" />
          ) : (
            <UserPlus className="h-8 w-8 text-slate-900" />
          )}
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight">
          {isEmployer ? 'Register Your Company' : 'Create Your Account'}
        </h1>
        <p className="text-lg text-gray-500">
          {isEmployer
            ? 'Start hiring top talent for your organization'
            : 'Join thousands of professionals finding their dream jobs'}
        </p>
      </div>

      <AccountTypeToggle accountType={accountType} onChange={setAccountType} />

      {isEmployer ? (
        <>
          <EmployerRegisterForm />
          <EmployerHighlights />
        </>
      ) : (
        <>
          <JobSeekerRegisterForm />
          <JobSeekerHighlights />
        </>
      )}
    </div>
  );
}

export default RegisterPage;
