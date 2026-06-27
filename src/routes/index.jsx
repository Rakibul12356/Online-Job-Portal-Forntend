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
        ],
      },
      { path: ROUTES.NOT_FOUND, Component: NotFoundPage },
    ],
  },
]);

export default router;
