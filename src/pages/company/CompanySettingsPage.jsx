import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context';
import { CompanySettingsContent } from '@/features/company/components/CompanySettingsContent';
import { employerService } from '@/services';
import { ROUTES } from '@/constants';
import { LoadingSpinner } from '@/components';

export function CompanySettingsPage() {
  const { isAuthenticated, user } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      setError(null);
      try {
        const response = await employerService.getCompanySettings();
        if (response.success && response.data) {
          setSettings(response.data);
        } else {
          setError('Failed to fetch company settings details');
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError(err.message || 'Error loading settings from server');
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated && user?.role === 'company') {
      loadSettings();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }

  if (user?.role !== 'company') {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !settings) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Settings</h1>
        <p className="mt-2 text-gray-500">{error || 'An error occurred.'}</p>
      </div>
    );
  }

  return <CompanySettingsContent user={user} settings={settings} />;
}

export default CompanySettingsPage;

