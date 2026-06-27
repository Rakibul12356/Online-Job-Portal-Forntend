import { Suspense } from 'react';
import { AppRouterProvider } from './RouterProvider';
import { AppContextProvider } from '@/context';
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
        <Suspense fallback={<PageLoader />}>
          <AppRouterProvider />
        </Suspense>
      </AppContextProvider>
    </ErrorBoundary>
  );
}

export default AppProviders;
