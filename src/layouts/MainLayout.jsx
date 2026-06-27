import { Outlet } from 'react-router-dom';
import { Footer, Navbar } from '@/components';

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="container mx-auto w-full flex-1 px-4 py-8 md:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
