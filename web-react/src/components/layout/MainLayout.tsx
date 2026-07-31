import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BottomNav } from '@/components/layout/BottomNav';

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-20 sm:pb-6">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
