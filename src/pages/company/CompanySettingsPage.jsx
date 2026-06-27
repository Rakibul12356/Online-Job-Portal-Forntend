import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context';
import { CompanySettingsContent } from '@/features/company/components/CompanySettingsContent';
import { ROUTES } from '@/constants';

export function CompanySettingsPage() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }

  if (user?.role !== 'company') {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <CompanySettingsContent user={user} />;
}

export default CompanySettingsPage;
