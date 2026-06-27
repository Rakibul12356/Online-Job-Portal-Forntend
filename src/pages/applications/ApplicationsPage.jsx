import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context';
import { ApplicationsContent } from '@/features/applications/components/ApplicationsContent';
import { ROUTES } from '@/constants';

export function ApplicationsPage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }

  return <ApplicationsContent />;
}

export default ApplicationsPage;
