import { useEffect, useState } from 'react';
import type { Banner } from '@/types';

export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners.length) return null;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="h-40 w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
        {banners[index]?.image_full_url && (
          <img
            key={banners[index].id}
            src={banners[index].image_full_url}
            alt={banners[index].title ?? ''}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      {banners.length > 1 && (
        <div className="flex gap-1">
          {banners.map((banner, i) => (
            <span
              key={banner.id}
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-4 bg-primary' : 'w-1.5 bg-primary/25'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
