import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function SectionHeader({ title, to }: { title: string; to?: string }) {
  const { t } = useTranslation();
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      {to && (
        <Link
          to={to}
          className="flex items-center gap-0.5 rounded-full bg-primary/10 py-1 pl-3 pr-2 text-xs font-medium text-primary"
        >
          {t('see_all')}
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
