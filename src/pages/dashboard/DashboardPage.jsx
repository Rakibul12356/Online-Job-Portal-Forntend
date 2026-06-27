import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context';
import { DashboardContent } from '@/features/dashboard/components/DashboardContent';
import { CompanyDashboardContent } from '@/features/dashboard/components/CompanyDashboardContent';
import { ROUTES } from '@/constants';

export function DashboardPage() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }

  if (user?.role === 'company') {
    return <CompanyDashboardContent firstName={user.firstName} />;
  }

  return <DashboardContent firstName={user.firstName} />;
}

export default DashboardPage;
