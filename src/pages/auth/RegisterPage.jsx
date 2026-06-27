import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';

export function RegisterPage() {
  return (
    <div className="mx-auto max-w-md text-center">
      <h1 className="text-2xl font-bold">Sign Up</h1>
      <p className="mt-2 text-gray-500">Registration page — coming soon.</p>
      <Link
        to={ROUTES.SIGN_IN}
        className="mt-6 inline-block text-sm font-medium text-slate-900 hover:underline"
      >
        Back to Sign In
      </Link>
    </div>
  );
}

export default RegisterPage;
