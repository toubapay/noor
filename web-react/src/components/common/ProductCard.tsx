import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import type { Item } from '@/types';
import { calculateDiscountedPrice, formatCurrency } from '@/utils/currency';
import { RatingStars } from '@/components/common/RatingStars';

export function ProductCard({ item, onAdd }: { item: Item; onAdd?: (item: Item) => void }) {
  const finalPrice = calculateDiscountedPrice(item.price, item.discount, item.discount_type);
  const hasDiscount = finalPrice < item.price;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
      <Link to={`/item/${item.id}`} className="block">
        <div className="aspect-square w-full overflow-hidden bg-gray-100">
          {item.image_full_url ? (
            <img
              src={item.image_full_url}
              alt={item.name}
              className="h-full w-full object-cover transition group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-300">No image</div>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <Link to={`/item/${item.id}`} className="line-clamp-2 text-sm font-medium text-gray-800">
          {item.name}
        </Link>
        <RatingStars rating={item.avg_rating} count={item.rating_count} />
        <div className="mt-auto flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold text-primary">{formatCurrency(finalPrice)}</span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">{formatCurrency(item.price)}</span>
            )}
          </div>
          {onAdd && (
            <button
              type="button"
              onClick={() => onAdd(item)}
              className="rounded-full bg-primary p-1.5 text-white transition hover:bg-primary-600"
              aria-label="Add to cart"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
