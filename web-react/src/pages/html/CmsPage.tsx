import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/api/endpoints';
import { Loader } from '@/components/common/Loader';

const fetchers: Record<string, () => Promise<unknown>> = {
  '/about-us': api.getAboutUs,
  '/privacy-policy': api.getPrivacyPolicy,
  '/terms-and-conditions': api.getTermsAndConditions,
  '/refund-policy': api.getRefundPolicy,
  '/shipping-policy': api.getShippingPolicy,
  '/cancellation-policy': api.getCancellationPolicy,
};

const titleKeys: Record<string, string> = {
  '/about-us': 'about_us',
  '/privacy-policy': 'privacy_policy',
  '/terms-and-conditions': 'terms_and_conditions',
};

export default function CmsPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const fetcher = fetchers[location.pathname] ?? api.getAboutUs;

  const { data, isLoading } = useQuery({ queryKey: ['cms', location.pathname], queryFn: fetcher });

  if (isLoading) return <Loader label={t('loading')} />;

  const html = (data as Record<string, string> | undefined) ?? {};
  const content = Object.values(html).find((v) => typeof v === 'string') ?? '';

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <h1 className="text-lg font-bold text-gray-800">{t(titleKeys[location.pathname] ?? 'about_us')}</h1>
      <div className="prose prose-sm max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
