import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

export function InstallPWAButton() {
  const { canInstall, promptInstall } = useInstallPrompt();
  const { t } = useTranslation();

  if (!canInstall) return null;

  return (
    <button
      type="button"
      onClick={promptInstall}
      className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-primary-600"
    >
      <Download className="h-3.5 w-3.5" />
      {t('install_app')}
    </button>
  );
}
