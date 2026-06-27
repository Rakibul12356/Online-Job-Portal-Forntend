import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';

export function NotFoundPage() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="mt-4 text-lg text-gray-600">Page not found</p>
      <Link
        to={ROUTES.HOME}
        className="mt-6 text-sm font-medium text-blue-600 hover:underline"
      >
        Back to Home
      </Link>
    </section>
  );
}

export default NotFoundPage;
