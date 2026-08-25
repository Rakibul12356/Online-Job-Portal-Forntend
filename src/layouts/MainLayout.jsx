import { Outlet, useLocation } from 'react-router-dom';
import { Footer, Navbar } from '@/components';
import { ROUTES } from '@/constants';

export function MainLayout() {
  const { pathname } = useLocation();
  const isChat = pathname === ROUTES.CHAT;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main
        className={`container mx-auto w-full flex-1 ${
          isChat ? 'px-4 py-4 md:px-8' : 'px-4 py-8 md:px-8'
        }`}
      >
        <Outlet />
      </main>
      {!isChat && <Footer />}
    </div>
  );
}

export default MainLayout;
