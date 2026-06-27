import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context';
import { CompanyProfileContent } from '@/features/company/components/CompanyProfileContent';
import { ROUTES } from '@/constants';

export function CompanyProfilePage() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }

  if (user?.role !== 'company') {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <CompanyProfileContent user={user} />;
}

export default CompanyProfilePage;
