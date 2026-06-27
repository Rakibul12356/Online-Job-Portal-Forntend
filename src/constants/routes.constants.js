export const ROUTES = {
  HOME: '/',
  JOBS: '/jobs',
  JOB_DETAIL: '/jobs/:jobId',
  COMPANIES: '/companies',
  COMPANY_DETAIL: '/companies/:companyId',
  APPLICATIONS: '/applications',
  PROFILE: '/profile',
  SAVED_JOBS: '/saved-jobs',
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
