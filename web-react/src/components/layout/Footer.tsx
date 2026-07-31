import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-12 border-t border-gray-100 bg-white py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-sm text-gray-500 sm:flex-row sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Noor. Tous droits réservés.</p>
        <nav className="flex flex-wrap gap-4">
          <Link to="/about-us" className="hover:text-primary">{t('about_us')}</Link>
          <Link to="/privacy-policy" className="hover:text-primary">{t('privacy_policy')}</Link>
          <Link to="/terms-and-conditions" className="hover:text-primary">{t('terms_and_conditions')}</Link>
          <Link to="/support" className="hover:text-primary">{t('support')}</Link>
        </nav>
      </div>
    </footer>
  );
}
