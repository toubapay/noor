import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  Wallet, Gift, Star, Heart, MapPin, Bell, MessageCircle, HelpCircle, LogOut, ChevronRight,
} from 'lucide-react';
import * as api from '@/api/endpoints';
import { Loader } from '@/components/common/Loader';
import { formatCurrency } from '@/utils/currency';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

const menuItems = [
  { to: '/orders', icon: ChevronRight, labelKey: 'order_history' },
  { to: '/wallet', icon: Wallet, labelKey: 'wallet' },
  { to: '/loyalty', icon: Star, labelKey: 'loyalty_points' },
  { to: '/refer-and-earn', icon: Gift, labelKey: 'refer_and_earn' },
  { to: '/favourites', icon: Heart, labelKey: 'favourites' },
  { to: '/addresses', icon: MapPin, labelKey: 'delivery_address' },
  { to: '/notifications', icon: Bell, labelKey: 'notifications' },
  { to: '/chat', icon: MessageCircle, labelKey: 'chat' },
  { to: '/support', icon: HelpCircle, labelKey: 'support' },
];

export default function ProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: user, isLoading } = useQuery({ queryKey: ['profile'], queryFn: api.getCustomerInfo });

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login', { replace: true });
  };

  if (isLoading) return <Loader label={t('loading')} />;

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4">
      <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4">
        <div className="h-14 w-14 overflow-hidden rounded-full bg-gray-100">
          {user?.image_full_url && <img src={user.image_full_url} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="flex-1">
          <p className="text-base font-semibold text-gray-800">{user ? `${user.f_name} ${user.l_name}` : 'Guest'}</p>
          <p className="text-xs text-gray-400">{user?.email}</p>
        </div>
        <Link to="/profile/edit" className="text-xs font-medium text-primary">{t('edit_profile')}</Link>
      </div>

      {user && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <p className="text-xs text-gray-400">{t('wallet_balance')}</p>
            <p className="text-base font-bold text-primary">{formatCurrency(user.wallet_balance ?? 0)}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <p className="text-xs text-gray-400">{t('loyalty_points')}</p>
            <p className="text-base font-bold text-primary">{user.loyalty_point ?? 0}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white">
        {menuItems.map(({ to, icon: Icon, labelKey }) => (
          <Link key={to} to={to} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700">
            <Icon className="h-4 w-4 text-gray-400" />
            {t(labelKey)}
            <ChevronRight className="ml-auto h-4 w-4 text-gray-300" />
          </Link>
        ))}
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 rounded-full border border-red-200 py-2.5 text-sm font-medium text-red-500"
      >
        <LogOut className="h-4 w-4" /> {t('logout')}
      </button>
    </div>
  );
}
