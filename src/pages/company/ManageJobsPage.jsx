import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context';
import { ManageJobsContent } from '@/features/company/components/ManageJobsContent';
import { ROUTES } from '@/constants';

export function ManageJobsPage() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }

  if (user?.role !== 'company') {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <ManageJobsContent />;
}

export default ManageJobsPage;
