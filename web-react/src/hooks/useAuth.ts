import { useAppSelector } from '@/store/hooks';

export function useAuth() {
  const { token, user, isGuest } = useAppSelector((s) => s.auth);
  return {
    token,
    user,
    isGuest,
    isAuthenticated: Boolean(token),
  };
}
