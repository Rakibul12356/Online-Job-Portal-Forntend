import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context';
import { CreateJobContent } from '@/features/company/components/CreateJobContent';
import { ROUTES } from '@/constants';

export function CreateJobPage() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }

  if (user?.role !== 'company') {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <CreateJobContent />;
}

export default CreateJobPage;
