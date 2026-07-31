import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Minus, Plus, Trash2 } from 'lucide-react';
import * as api from '@/api/endpoints';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { formatCurrency } from '@/utils/currency';
import { showApiError } from '@/utils/toast';

export default function CartPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery({ queryKey: ['cart'], queryFn: api.getCartList });

  const updateMutation = useMutation({
    mutationFn: (payload: { cart_id: number; quantity: number }) => api.updateCartItem(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
    onError: (err) => showApiError(err),
  });

  const removeMutation = useMutation({
    mutationFn: (cartId: number) => api.removeCartItem(cartId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
    onError: (err) => showApiError(err),
  });

  if (isLoading) return <Loader label={t('loading')} />;
  if (!items?.length) return <EmptyState message={t('empty_cart')} />;

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-bold text-gray-800">{t('cart')}</h1>
      <div className="flex flex-col gap-3">
        {items.map((cartItem) => (
          <div key={cartItem.id} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
              {cartItem.item?.image_full_url && (
                <img src={cartItem.item.image_full_url} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <Link to={`/item/${cartItem.item_id}`} className="line-clamp-1 text-sm font-medium text-gray-800">
                {cartItem.item?.name}
              </Link>
              <p className="text-sm font-semibold text-primary">{formatCurrency(cartItem.price)}</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-gray-200 px-2 py-1">
              <button
                type="button"
                onClick={() => updateMutation.mutate({ cart_id: cartItem.id, quantity: Math.max(1, cartItem.quantity - 1) })}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-5 text-center text-sm">{cartItem.quantity}</span>
              <button
                type="button"
                onClick={() => updateMutation.mutate({ cart_id: cartItem.id, quantity: cartItem.quantity + 1 })}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <button type="button" onClick={() => removeMutation.mutate(cartItem.id)} className="p-1 text-gray-400">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
        <span className="text-sm text-gray-500">{t('subtotal')}</span>
        <span className="text-base font-bold text-gray-800">{formatCurrency(subtotal)}</span>
      </div>

      <button
        type="button"
        onClick={() => navigate('/checkout')}
        className="rounded-full bg-primary py-3 text-sm font-semibold text-white"
      >
        {t('checkout')}
      </button>
    </div>
  );
}
