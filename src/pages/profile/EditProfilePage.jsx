import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context';
import { EditProfileContent } from '@/features/profile/components/EditProfileContent';
import { ROUTES } from '@/constants';

export function EditProfilePage() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }

  return <EditProfileContent user={user} />;
}

export default EditProfilePage;
