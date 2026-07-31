import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/api/endpoints';
import { Loader } from '@/components/common/Loader';

export default function SupportPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({ queryKey: ['about-us'], queryFn: api.getAboutUs });

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4">
      <h1 className="text-lg font-bold text-gray-800">{t('support')}</h1>
      <p className="text-sm text-gray-500">
        Need help with an order, payment, or your account? Reach us any time:
      </p>
      <div className="rounded-xl border border-gray-100 bg-white p-4 text-sm text-gray-700">
        <p>Email: support@marcheocass.com</p>
        <p>Phone: +221 XX XXX XX XX</p>
      </div>
      {isLoading ? <Loader /> : (
        <div
          className="prose prose-sm max-w-none text-gray-600"
          dangerouslySetInnerHTML={{ __html: (data as { about_us?: string })?.about_us ?? '' }}
        />
      )}
    </div>
  );
}
