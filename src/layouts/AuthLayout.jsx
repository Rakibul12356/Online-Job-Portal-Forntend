import { Outlet } from 'react-router-dom';

/**
 * Shell layout for auth-related pages (login, register).
 * No auth logic — structure only.
 */
export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
