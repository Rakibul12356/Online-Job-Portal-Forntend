import { Outlet } from 'react-router-dom';

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Outlet />
    </div>
  );
}

export default RootLayout;
