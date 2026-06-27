import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context';
import { ProfileContent } from '@/features/profile/components/ProfileContent';
import { ROUTES } from '@/constants';

export function ProfilePage() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }

  return <ProfileContent user={user} />;
}

export default ProfilePage;
