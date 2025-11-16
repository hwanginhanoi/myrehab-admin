'use client';

import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { CarouselBannerResponse } from '@/api/types/CarouselBannerResponse';
import { Image as ImageIcon } from 'lucide-react';

interface CarouselBannerPreviewProps {
  banners: CarouselBannerResponse[];
}

export function CarouselBannerPreview({ banners }: CarouselBannerPreviewProps) {
  const activeBanners = banners.filter(banner => banner.isActive);

  if (activeBanners.length === 0) {
    return (
      <Card className="w-full p-8 text-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <ImageIcon className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">
            Không có banner nào để hiển thị. Vui lòng tạo và kích hoạt banner.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full px-12">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {activeBanners.map((banner) => (
            <CarouselItem key={banner.id}>
              <Card className="overflow-hidden">
                <div className="relative aspect-[21/9] w-full">
                  {banner.imageUrl ? (
                    <img
                      src={banner.imageUrl}
                      alt={banner.title || 'Banner'}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.png';
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <ImageIcon className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  {banner.title && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                      <h3 className="text-2xl font-bold text-white">
                        {banner.title}
                      </h3>
                      {banner.description && (
                        <p className="mt-2 text-sm text-white/90">
                          {banner.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
