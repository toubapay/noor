import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Copy, Share2 } from 'lucide-react';
import * as api from '@/api/endpoints';
import { Loader } from '@/components/common/Loader';
import { toast } from '@/utils/toast';

export default function ReferAndEarnPage() {
  const { t } = useTranslation();
  const { data: user, isLoading } = useQuery({ queryKey: ['profile'], queryFn: api.getCustomerInfo });

  const copyCode = async () => {
    if (!user?.ref_code) return;
    await navigator.clipboard.writeText(user.ref_code);
    toast.success('Copied to clipboard');
  };

  const share = async () => {
    if (!user?.ref_code) return;
    const shareText = `Use my referral code ${user.ref_code} to sign up on Noor!`;
    if (navigator.share) {
      await navigator.share({ text: shareText });
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success('Copied to clipboard');
    }
  };

  if (isLoading) return <Loader label={t('loading')} />;

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 text-center">
      <h1 className="text-lg font-bold text-gray-800">{t('refer_and_earn')}</h1>
      <p className="text-sm text-gray-500">
        Invite your friends to Noor. They register with your code, get a special offer, and you earn a reward once
        they place their first order.
      </p>
      <div className="rounded-2xl border border-dashed border-primary bg-primary-50 p-6">
        <p className="text-xs text-gray-500">{t('your_referral_code')}</p>
        <p className="text-2xl font-bold tracking-widest text-primary">{user?.ref_code ?? '—'}</p>
      </div>
      <div className="flex justify-center gap-3">
        <button type="button" onClick={copyCode} className="flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-sm">
          <Copy className="h-4 w-4" /> Copy
        </button>
        <button type="button" onClick={share} className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm text-white">
          <Share2 className="h-4 w-4" /> Share
        </button>
      </div>
    </div>
  );
}
