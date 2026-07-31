import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold text-primary">Noor</h1>
        <Outlet />
      </div>
    </div>
  );
}
