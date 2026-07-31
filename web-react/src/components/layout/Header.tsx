import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, ShoppingCart, Bell, User } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { ModuleSwitcher } from '@/components/common/ModuleSwitcher';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { InstallPWAButton } from '@/components/common/InstallPWAButton';

export function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { totalQuantity } = useCart();
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link to="/" className="text-lg font-bold text-primary">
          Noor
        </Link>
        <ModuleSwitcher />
        <button
          type="button"
          onClick={() => navigate('/search')}
          className="flex flex-1 items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-400"
        >
          <Search className="h-4 w-4" />
          <span className="truncate">{t('search_hint')}</span>
        </button>
        <InstallPWAButton />
        <LanguageSwitcher />
        <Link to="/notifications" className="relative rounded-full p-2 hover:bg-gray-50" aria-label={t('notifications')}>
          <Bell className="h-5 w-5 text-gray-600" />
        </Link>
        <Link to="/cart" className="relative rounded-full p-2 hover:bg-gray-50" aria-label={t('cart')}>
          <ShoppingCart className="h-5 w-5 text-gray-600" />
          {totalQuantity > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
              {totalQuantity}
            </span>
          )}
        </Link>
        <Link
          to={isAuthenticated ? '/profile' : '/auth/login'}
          className="rounded-full p-2 hover:bg-gray-50"
          aria-label={t('account')}
        >
          <User className="h-5 w-5 text-gray-600" />
        </Link>
      </div>
    </header>
  );
}
