import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import type { Store } from '@/types';
import { RatingStars } from '@/components/common/RatingStars';

export function StoreCard({ store }: { store: Store }) {
  return (
    <Link
      to={`/store/${store.id}`}
      className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="h-28 w-full overflow-hidden bg-gray-100">
        {store.cover_photo_full_url ? (
          <img src={store.cover_photo_full_url} alt={store.name} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">No image</div>
        )}
      </div>
      <div className="flex items-center gap-2 p-3">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border bg-white">
          {store.logo_full_url && <img src={store.logo_full_url} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-800">{store.name}</p>
          <div className="flex items-center gap-2">
            <RatingStars rating={store.avg_rating} count={store.rating_count} />
            {store.delivery_time && (
              <span className="flex items-center gap-0.5 text-xs text-gray-400">
                <Clock className="h-3 w-3" /> {store.delivery_time}
              </span>
            )}
          </div>
        </div>
        {!store.open && (
          <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-500">Closed</span>
        )}
      </div>
    </Link>
  );
}
