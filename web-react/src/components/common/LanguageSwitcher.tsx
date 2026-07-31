import { useTranslation } from 'react-i18next';
import { Languages } from '@/config/constants';
import { useAppDispatch } from '@/store/hooks';
import { setLanguage } from '@/store/slices/uiSlice';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    dispatch(setLanguage(code));
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = code;
  };

  return (
    <select
      value={i18n.language}
      onChange={(e) => changeLanguage(e.target.value)}
      className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-700"
      aria-label="Language"
    >
      {Languages.map((lang) => (
        <option key={lang.languageCode} value={lang.languageCode}>
          {lang.languageName}
        </option>
      ))}
    </select>
  );
}
