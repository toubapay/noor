import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/api/endpoints';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { formatCurrency } from '@/utils/currency';

export default function WalletPage() {
  const { t } = useTranslation();
  const user = useQuery({ queryKey: ['profile'], queryFn: api.getCustomerInfo });
  const transactions = useQuery({ queryKey: ['wallet-transactions'], queryFn: () => api.getWalletTransactions(1) });

  if (user.isLoading || transactions.isLoading) return <Loader label={t('loading')} />;

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4">
      <h1 className="text-lg font-bold text-gray-800">{t('wallet')}</h1>
      <div className="rounded-2xl bg-primary p-6 text-white">
        <p className="text-xs opacity-80">{t('wallet_balance')}</p>
        <p className="text-2xl font-bold">{formatCurrency(user.data?.wallet_balance ?? 0)}</p>
      </div>

      <h2 className="text-sm font-semibold text-gray-700">Transactions</h2>
      {transactions.data?.transactions?.length ? (
        <div className="flex flex-col gap-2">
          {transactions.data.transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3">
              <div>
                <p className="text-sm capitalize text-gray-700">{tx.transaction_type.replace(/_/g, ' ')}</p>
                <p className="text-xs text-gray-400">{new Date(tx.created_at).toLocaleDateString()}</p>
              </div>
              <span className={`text-sm font-semibold ${tx.credit > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {tx.credit > 0 ? '+' : '-'}{formatCurrency(tx.credit > 0 ? tx.credit : tx.debit)}
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
