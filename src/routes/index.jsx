import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { RootLayout, MainLayout } from '@/layouts';
import {
  HomePage,
  JobsListPage,
  JobDetailPage,
  CompaniesListPage,
  ApplicationsPage,
  NotFoundPage,
  SignInPage,
  RegisterPage,
  DashboardPage,
  ProfilePage,
  EditProfilePage,
  CompanySettingsPage,
  CreateJobPage,
  ManageJobsPage,
  CompanyApplicantsPage,
} from './lazyRoutes';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, Component: HomePage },
          { path: ROUTES.JOBS, Component: JobsListPage },
          { path: ROUTES.JOB_DETAIL, Component: JobDetailPage },
          { path: ROUTES.COMPANIES, Component: CompaniesListPage },
          { path: ROUTES.APPLICATIONS, Component: ApplicationsPage },
          { path: ROUTES.SIGN_IN, Component: SignInPage },
          { path: ROUTES.REGISTER, Component: RegisterPage },
          { path: ROUTES.DASHBOARD, Component: DashboardPage },
          { path: ROUTES.PROFILE, Component: ProfilePage },
          { path: ROUTES.EDIT_PROFILE, Component: EditProfilePage },
          { path: ROUTES.COMPANY_SETTINGS, Component: CompanySettingsPage },
          { path: ROUTES.CREATE_JOB, Component: CreateJobPage },
          { path: ROUTES.MANAGE_JOBS, Component: ManageJobsPage },
          { path: ROUTES.COMPANY_APPLICANTS, Component: CompanyApplicantsPage },
        ],
      },
      { path: ROUTES.NOT_FOUND, Component: NotFoundPage },
    ],
  },
]);

export default router;
