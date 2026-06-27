import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { ROUTES } from '@/constants';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <nav className="mx-auto flex h-16 container items-center justify-between px-6 md:px-10">
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2.5 text-black transition-opacity hover:opacity-80"
        >
          <Briefcase className="h-[22px] w-[22px]" strokeWidth={2.25} aria-hidden="true" />
          <span className="text-lg font-bold tracking-tight">Online Job Portal</span>
        </Link>

        <div className="flex items-center gap-8">
          <Link
            to={ROUTES.SIGN_IN}
            className="text-[15px] font-normal text-black transition-colors hover:text-gray-600"
          >
            Sign In
          </Link>
          <button
            type="button"
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Post a Job
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
