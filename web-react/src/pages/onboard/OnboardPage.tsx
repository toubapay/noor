import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const slides = [
  { title: 'trusted_by_customers_and_store_owners', body: 'Trusted by thousands of customers and store owners across Senegal.' },
  { title: 'thousands_of_stores', body: 'Thousands of stores, restaurants, and pharmacies at your fingertips.' },
  { title: 'excellent_shopping_experience', body: 'An excellent, fast shopping experience, wherever you are.' },
  { title: 'easy_checkout_and_payment_system', body: 'Easy checkout with cash, mobile money, or card.' },
];

export default function OnboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="grid gap-6 sm:grid-cols-2">
        {slides.map((slide) => (
          <div key={slide.title} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-600">{slide.body}</p>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => navigate('/select-module')}
        className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white"
      >
        Get started
      </button>
    </div>
  );
}
