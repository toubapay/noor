import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as api from '@/api/endpoints';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { formatCurrency } from '@/utils/currency';
import { useAppSelector } from '@/store/hooks';
import { showApiError, toast } from '@/utils/toast';

type PaymentMethod = 'cash_on_delivery' | 'wallet' | 'digital_payment';

export default function CheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const selectedAddress = useAppSelector((s) => s.address.selected);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_delivery');

  const cart = useQuery({ queryKey: ['cart'], queryFn: api.getCartList });
  const addresses = useQuery({ queryKey: ['addresses'], queryFn: api.getAddresses });

  const subtotal = (cart.data ?? []).reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = appliedCoupon?.discount ?? 0;
  const total = Math.max(subtotal - discount, 0);

  const activeAddress = selectedAddress ?? addresses.data?.[0];

  const applyCouponMutation = useMutation({
    mutationFn: () => api.applyCoupon(couponCode, cart.data?.[0]?.item?.store_id ?? 0),
    onSuccess: (data) => {
      setAppliedCoupon({ code: couponCode, discount: Number(data?.discount ?? 0) });
      toast.success('Coupon applied');
    },
    onError: (err) => showApiError(err, 'Invalid coupon'),
  });

  const placeOrderMutation = useMutation({
    mutationFn: () =>
      api.placeOrder({
        cart_id: (cart.data ?? []).map((i) => i.id),
        address_id: activeAddress?.id,
        payment_method: paymentMethod,
        order_type: 'delivery',
        coupon_code: appliedCoupon?.code,
      }),
    onSuccess: (data) => {
      toast.success('Order placed');
      navigate(`/orders/${data.order_id ?? ''}`.replace(/\/$/, '/success'));
    },
    onError: (err) => showApiError(err, 'Could not place order'),
  });

  if (cart.isLoading) return <Loader label={t('loading')} />;
  if (!cart.data?.length) return <EmptyState message={t('empty_cart')} />;

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-5">
      <h1 className="text-lg font-bold text-gray-800">{t('checkout')}</h1>

      <section className="rounded-xl border border-gray-100 bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold text-gray-700">{t('delivery_address')}</h2>
        {activeAddress ? (
          <p className="text-sm text-gray-600">{activeAddress.address}</p>
        ) : (
          <p className="text-sm text-gray-400">No address selected</p>
        )}
        <button type="button" onClick={() => navigate('/addresses')} className="mt-2 text-xs text-primary">
          {t('add_new_address')}
        </button>
      </section>

      <section className="rounded-xl border border-gray-100 bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold text-gray-700">{t('coupon')}</h2>
        <div className="flex gap-2">
          <input
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder={t('coupon')}
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => applyCouponMutation.mutate()}
            disabled={!couponCode || applyCouponMutation.isPending}
            className="rounded-lg bg-primary px-4 text-sm text-white disabled:opacity-60"
          >
            {t('apply')}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-gray-100 bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold text-gray-700">{t('payment_method')}</h2>
        <div className="flex flex-col gap-2">
          {(['cash_on_delivery', 'digital_payment', 'wallet'] as PaymentMethod[]).map((method) => (
            <label key={method} className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === method}
                onChange={() => setPaymentMethod(method)}
              />
              {t(method)}
            </label>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-1.5 rounded-xl border border-gray-100 bg-white p-4 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>{t('subtotal')}</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-gray-500">
            <span>{t('discount')}</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-gray-100 pt-1.5 text-base font-bold text-gray-800">
          <span>{t('total')}</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </section>

      <button
        type="button"
        onClick={() => placeOrderMutation.mutate()}
        disabled={placeOrderMutation.isPending || !activeAddress}
        className="rounded-full bg-primary py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {t('place_order')}
      </button>
    </div>
  );
}
