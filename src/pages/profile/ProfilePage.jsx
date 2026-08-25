import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context';
import { ProfileContent } from '@/features/profile/components/ProfileContent';
import { seekerService } from '@/services';
import { ROUTES } from '@/constants';
import { LoadingSpinner } from '@/components';

export function ProfilePage() {
  const { isAuthenticated, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setError(null);
      try {
        const response = await seekerService.getProfile();
        if (response.success && response.data) {
          setProfile(response.data);
        } else {
          setError('Failed to fetch profile details');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Error loading profile from server');
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated && user?.role !== 'company') {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }

  if (user?.role === 'company') {
    return <Navigate to={ROUTES.COMPANY_PROFILE} replace />;
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Profile</h1>
        <p className="mt-2 text-gray-500">{error || 'An error occurred.'}</p>
      </div>
    );
  }

  return <ProfileContent user={user} profile={profile} />;
}

export default ProfilePage;

