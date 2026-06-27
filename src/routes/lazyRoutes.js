import { lazy } from 'react';

export const HomePage = lazy(() => import('@/pages/HomePage'));
export const JobsListPage = lazy(() => import('@/pages/jobs/JobsListPage'));
export const JobDetailPage = lazy(() => import('@/pages/jobs/JobDetailPage'));
export const CompaniesListPage = lazy(
  () => import('@/pages/companies/CompaniesListPage'),
);
export const ApplicationsPage = lazy(
  () => import('@/pages/applications/ApplicationsPage'),
);
export const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

