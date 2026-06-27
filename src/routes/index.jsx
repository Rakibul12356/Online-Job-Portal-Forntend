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
        ],
      },
      { path: ROUTES.NOT_FOUND, Component: NotFoundPage },
    ],
  },
]);

export default router;
