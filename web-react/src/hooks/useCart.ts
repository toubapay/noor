import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';

export function useCart() {
  const items = useAppSelector((s) => s.cart.items);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  );
  const totalQuantity = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  return { items, subtotal, totalQuantity };
}
