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
export const SignInPage = lazy(() => import('@/pages/auth/SignInPage'));
export const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
export const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
export const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));
