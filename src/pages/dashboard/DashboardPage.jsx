import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context';
import { DashboardContent } from '@/features/dashboard/components/DashboardContent';
import { ROUTES } from '@/constants';

export function DashboardPage() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }

  return <DashboardContent firstName={user.firstName} />;
}

export default DashboardPage;
