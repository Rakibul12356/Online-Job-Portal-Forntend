import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context';
import { CompanyApplicantsContent } from '@/features/company/components/CompanyApplicantsContent';
import { ROUTES } from '@/constants';

export function CompanyApplicantsPage() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }

  if (user?.role !== 'company') {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <CompanyApplicantsContent />;
}

export default CompanyApplicantsPage;
