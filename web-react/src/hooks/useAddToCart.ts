import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/api/endpoints';
import { useAppDispatch } from '@/store/hooks';
import { upsertCartItem } from '@/store/slices/cartSlice';
import { showApiError, toast } from '@/utils/toast';
import type { Item } from '@/types';

export function useAddToCart() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (item: Item) => api.addToCart({ item_id: item.id, model_id: item.store_id, quantity: 1 }),
    onSuccess: (data) => {
      if (data?.cart) dispatch(upsertCartItem(data.cart));
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Added to cart');
    },
    onError: (err) => showApiError(err, 'Could not add to cart'),
  });

  return useCallback((item: Item) => mutation.mutate(item), [mutation]);
}
