import { useTranslation } from 'react-i18next';
import { Car } from 'lucide-react';

// This module (vehicle rental / ride-hailing, "rental" module in the API)
// has a much larger surface than the rest of the app — live map tracking,
// vehicle search, trip booking, driver assignment — and needs a Google Maps
// key wired up (see .env.example) before it's worth building out fully.
// This is a placeholder landing page so the route/module exists.
export default function RentalPage() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-3 py-20 text-center text-gray-500">
      <Car className="h-12 w-12 text-primary" />
      <h1 className="text-lg font-bold text-gray-800">{t('rental')}</h1>
      <p className="text-sm">
        Vehicle rental / ride booking is coming soon on the web. Use the mobile app for now.
      </p>
    </div>
  );
}
