import { Link } from 'react-router-dom';
import type { Category } from '@/types';

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link to={`/category/${category.id}`} className="flex flex-col items-center gap-2 text-center">
      <div className="h-16 w-16 overflow-hidden rounded-full border border-gray-100 bg-white shadow-sm">
        {category.image_full_url ? (
          <img src={category.image_full_url} alt={category.name} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="h-full w-full bg-gray-100" />
        )}
      </div>
      <span className="line-clamp-1 w-16 text-xs text-gray-600">{category.name}</span>
    </Link>
  );
}
