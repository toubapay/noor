import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function ProtectedRoute() {
  const { isAuthenticated, isGuest } = useAuth();
  const location = useLocation();

  if (!isAuthenticated && !isGuest) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
