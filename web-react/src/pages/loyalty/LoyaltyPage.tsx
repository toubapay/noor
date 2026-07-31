import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '@/api/endpoints';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { showApiError, toast } from '@/utils/toast';

export default function LoyaltyPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const user = useQuery({ queryKey: ['profile'], queryFn: api.getCustomerInfo });
  const transactions = useQuery({ queryKey: ['loyalty-transactions'], queryFn: () => api.getLoyaltyTransactions(1) });

  const transferMutation = useMutation({
    mutationFn: api.transferLoyaltyPoints,
    onSuccess: () => {
      toast.success('Points converted to wallet balance');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['loyalty-transactions'] });
    },
    onError: (err) => showApiError(err),
  });

  if (user.isLoading || transactions.isLoading) return <Loader label={t('loading')} />;

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4">
      <h1 className="text-lg font-bold text-gray-800">{t('loyalty_points')}</h1>
      <div className="rounded-2xl bg-primary p-6 text-white">
        <p className="text-xs opacity-80">{t('loyalty_points')}</p>
        <p className="text-2xl font-bold">{user.data?.loyalty_point ?? 0}</p>
        <button
          type="button"
          onClick={() => transferMutation.mutate()}
          disabled={transferMutation.isPending}
          className="mt-3 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-primary disabled:opacity-60"
        >
          Convert to wallet
        </button>
      </div>

      {transactions.data?.transactions?.length ? (
        <div className="flex flex-col gap-2">
          {transactions.data.transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3">
              <p className="text-sm capitalize text-gray-700">{tx.transaction_type.replace(/_/g, ' ')}</p>
              <span className={`text-sm font-semibold ${tx.credit > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {tx.credit > 0 ? `+${tx.credit}` : `-${tx.debit}`}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message={t('no_data_found')} />
      )}
    </div>
  );
}
