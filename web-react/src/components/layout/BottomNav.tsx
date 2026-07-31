import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, ShoppingCart, ClipboardList, User } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-1 flex-col items-center gap-0.5 py-2 text-xs ${isActive ? 'text-primary' : 'text-gray-400'}`;

export function BottomNav() {
  const { t } = useTranslation();
  const { totalQuantity } = useCart();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-gray-100 bg-white shadow-[0_-1px_6px_rgba(0,0,0,0.04)] sm:hidden">
      <NavLink to="/" end className={linkClass}>
        <Home className="h-5 w-5" />
        {t('home')}
      </NavLink>
      <NavLink to="/orders" className={linkClass}>
        <ClipboardList className="h-5 w-5" />
        {t('orders')}
      </NavLink>
      <NavLink to="/cart" className={linkClass}>
        <div className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalQuantity > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] text-white">
              {totalQuantity}
            </span>
          )}
        </div>
        {t('cart')}
      </NavLink>
      <NavLink to="/profile" className={linkClass}>
        <User className="h-5 w-5" />
        {t('account')}
      </NavLink>
    </nav>
  );
}
