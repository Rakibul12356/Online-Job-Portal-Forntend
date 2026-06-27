export const ROUTES = {
  HOME: '/',
  JOBS: '/jobs',
  JOB_DETAIL: '/jobs/:jobId',
  COMPANIES: '/companies',
  COMPANY_DETAIL: '/companies/:companyId',
  APPLICATIONS: '/applications',
  PROFILE: '/profile',
  EDIT_PROFILE: '/profile/edit',
  SAVED_JOBS: '/saved-jobs',
  SIGN_IN: '/sign-in',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  COMPANY_SETTINGS: '/company/settings',
  CREATE_JOB: '/company/jobs/create',
  MANAGE_JOBS: '/company/jobs',
  NOT_FOUND: '*',
};

export const ROUTE_LABELS = {
  [ROUTES.HOME]: 'Home',
  [ROUTES.JOBS]: 'Jobs',
  [ROUTES.COMPANIES]: 'Companies',
  [ROUTES.APPLICATIONS]: 'Applications',
  [ROUTES.PROFILE]: 'Profile',
  [ROUTES.SAVED_JOBS]: 'Saved Jobs',
};

export default ROUTES;
