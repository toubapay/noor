import { Star } from 'lucide-react';

export function RatingStars({ rating = 0, count }: { rating?: number; count?: number }) {
  return (
    <div className="flex items-center gap-1 text-xs text-gray-500">
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      <span className="font-medium text-gray-700">{rating.toFixed(1)}</span>
      {typeof count === 'number' && <span>({count})</span>}
    </div>
  );
}
