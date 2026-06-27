import { Suspense } from 'react';
import { AppRouterProvider } from './RouterProvider';
import { AppContextProvider, AuthProvider } from '@/context';
import { ErrorBoundary, LoadingSpinner } from '@/components';

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}

export function AppProviders() {
  return (
    <ErrorBoundary>
      <AppContextProvider>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <AppRouterProvider />
          </Suspense>
        </AuthProvider>
      </AppContextProvider>
    </ErrorBoundary>
  );
}

export default AppProviders;
