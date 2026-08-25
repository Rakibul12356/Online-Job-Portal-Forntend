import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Briefcase, Building2, LogOut, Plus, User, Menu, X } from 'lucide-react';
import { ROUTES } from '@/constants';
import { useAuth } from '@/context';

const userNavLinks = [
  { to: ROUTES.HOME, label: 'Jobs' },
  { to: ROUTES.DASHBOARD, label: 'Dashboard' },
  { to: ROUTES.APPLICATIONS, label: 'My Applications' },
  { to: ROUTES.CHAT, label: 'Messages' },
];

const companyNavLinks = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard' },
  { to: ROUTES.MANAGE_JOBS, label: 'Manage Jobs' },
  { to: ROUTES.COMPANY_APPLICANTS, label: 'Applicants' },
  { to: ROUTES.CHAT, label: 'Messages' },
];

export function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const isSignInPage = pathname === ROUTES.SIGN_IN;
  const isRegisterPage = pathname === ROUTES.REGISTER;

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    setIsProfileOpen(false);
    navigate(ROUTES.HOME);
  }

  function renderGuestActions() {
    if (isSignInPage) {
      return (
        <p className="text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link
            to={ROUTES.REGISTER}
            className="font-semibold text-slate-900 transition-colors hover:text-slate-700"
          >
            Sign Up
          </Link>
        </p>
      );
    }

    if (isRegisterPage) {
      return (
        <p className="text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            to={ROUTES.SIGN_IN}
            className="font-semibold text-slate-900 transition-colors hover:text-slate-700"
          >
            Sign In
          </Link>
        </p>
      );
    }

    return (
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
    );
  }

  if (isAuthenticated) {
    const isCompany = user?.role === 'company';
    const navLinks = isCompany ? companyNavLinks : userNavLinks;

    return (
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-8">
            <Link
              to={ROUTES.HOME}
              className="flex items-center gap-2 text-black transition-opacity hover:opacity-80"
            >
              <Briefcase className="h-8 w-8 text-slate-900" strokeWidth={2} />
              <span className="text-xl font-bold">Online Job Portal</span>
            </Link>
            <div className="hidden items-center gap-6 lg:flex">
              {navLinks.map(({ to, label }) =>
                to.startsWith('#') ? (
                  <button
                    key={label}
                    type="button"
                    className="text-sm font-medium text-gray-500 transition-colors hover:text-slate-900"
                  >
                    {label}
                  </button>
                ) : (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === ROUTES.HOME}
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-slate-900 font-semibold'
                          : 'text-gray-500 hover:text-slate-900'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ),
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isCompany && (
              <Link
                to={ROUTES.CREATE_JOB}
                className="hidden sm:flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                <Plus className="mr-2 h-4 w-4" />
                Post Job
              </Link>
            )}

            <div ref={profileRef} className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setIsProfileOpen((open) => !open)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-100"
                aria-expanded={isProfileOpen}
                aria-haspopup="menu"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  {isCompany ? (
                    <Building2 className="h-4 w-4 text-slate-900" />
                  ) : (
                    <User className="h-4 w-4 text-slate-900" />
                  )}
                </div>
                <span className="text-sm font-medium">
                  {user?.name}
                </span>
              </button>

              {isProfileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
                >
                  {!isCompany && (
                    <Link
                      to={ROUTES.PROFILE}
                      role="menuitem"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  )}
                  {isCompany && (
                    <Link
                      to={ROUTES.COMPANY_PROFILE}
                      role="menuitem"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      <Building2 className="h-4 w-4" />
                      Company Profile
                    </Link>
                  )}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Hamburger Button for mobile menu */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-slate-900" />
              ) : (
                <Menu className="h-6 w-6 text-slate-900" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 z-50 border-t border-gray-100 bg-white px-6 py-5 shadow-lg lg:hidden transition-all duration-300 animate-slide-down">
            <div className="flex flex-col gap-4">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === ROUTES.HOME}
                  className={({ isActive }) =>
                    `block py-1.5 text-base font-semibold transition-colors ${
                      isActive ? 'text-slate-900' : 'text-gray-500 hover:text-slate-900'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}

              {isCompany && (
                <Link
                  to={ROUTES.CREATE_JOB}
                  className="flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-base font-semibold text-white transition-colors hover:bg-slate-800 mt-2"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Post Job
                </Link>
              )}

              <hr className="border-gray-100 my-2" />

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 px-1 py-1">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 shrink-0">
                    {isCompany ? (
                      <Building2 className="h-5 w-5 text-slate-900" />
                    ) : (
                      <User className="h-5 w-5 text-slate-900" />
                    )}
                  </div>
                  <span className="text-sm font-bold text-gray-800 truncate">
                    {user?.name}
                  </span>
                </div>

                {!isCompany && (
                  <Link
                    to={ROUTES.PROFILE}
                    className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                )}
                {isCompany && (
                  <Link
                    to={ROUTES.COMPANY_PROFILE}
                    className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Building2 className="h-4 w-4" />
                    Company Profile
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <nav className="container mx-auto flex h-16 items-center justify-between px-6 md:px-10">
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2.5 text-black transition-opacity hover:opacity-80"
        >
          <Briefcase className="h-[22px] w-[22px]" strokeWidth={2.25} aria-hidden="true" />
          <span className="text-lg font-bold tracking-tight">Online Job Portal</span>
        </Link>
        {renderGuestActions()}
      </nav>
    </header>
  );
}

export default Navbar;
