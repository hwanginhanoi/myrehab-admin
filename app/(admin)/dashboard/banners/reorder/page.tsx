'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, GripVertical, Save, Image as ImageIcon } from 'lucide-react';
import { getAllBanners } from '@/api/api/carouselBannerManagementController';
import { reorderBanners } from '@/api/api/carouselBannerManagementController';
import type { CarouselBannerResponse } from '@/api/types/CarouselBannerResponse';
import { toast } from 'sonner';
import { CarouselBannerPreview } from '@/components/carousel-banner-preview';

interface SortableBannerItemProps {
  banner: CarouselBannerResponse;
  index: number;
}

function SortableBannerItem({ banner, index }: SortableBannerItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: banner.id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 rounded-lg border bg-card p-4 shadow-sm"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="flex h-12 w-20 items-center justify-center rounded border bg-muted">
        <span className="text-lg font-bold text-muted-foreground">
          {index + 1}
        </span>
      </div>

      <div className="h-16 w-28 overflow-hidden rounded border">
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
            <ImageIcon className="h-8 w-8 text-gray-400" />
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="font-semibold">{banner.title || 'Untitled Banner'}</div>
        {banner.description && (
          <div className="text-sm text-muted-foreground line-clamp-1">
            {banner.description}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Badge variant={banner.isActive ? 'default' : 'secondary'}>
          {banner.isActive ? 'Hoạt động' : 'Tắt'}
        </Badge>
        {banner.shouldDisplay && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Đang hiển thị
          </Badge>
        )}
      </div>
    </div>
  );
}

export default function BannerReorderPage() {
  const router = useRouter();
  const [banners, setBanners] = useState<CarouselBannerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllBanners();
      // Sort by displayOrder
      const sortedData = (data || []).sort(
        (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
      );
      setBanners(sortedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch banners';
      toast.error('Failed to load banners', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setBanners((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        setHasChanges(true);
        return newItems;
      });
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const bannerIds = banners.map((banner) => banner.id!);
      await reorderBanners({ bannerIds });
      toast.success('Thứ tự banner đã được cập nhật thành công');
      setHasChanges(false);
      // Refresh to get updated displayOrder values
      await fetchBanners();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reorder banners';
      toast.error('Failed to save banner order', {
        description: errorMessage,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="m-9">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">
                Sắp xếp Banner
              </h1>
              <p className="text-base text-[#71717A]">
                Đang tải...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="m-9">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">
              Sắp xếp Banner
            </h1>
            <p className="text-base text-[#71717A]">
              Kéo thả để sắp xếp thứ tự hiển thị banner
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/banners')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="bg-[#6DBAD6] hover:bg-[#5ca9c5] text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </div>

        {/* Preview Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-[#6DBAD6]">Xem trước Banner</CardTitle>
          </CardHeader>
          <CardContent>
            <CarouselBannerPreview banners={banners} />
          </CardContent>
        </Card>

        {/* Sortable List Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#6DBAD6]">
              Danh sách Banner ({banners.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {banners.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                Không có banner nào. Vui lòng tạo banner mới.
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={banners.map((b) => b.id!)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {banners.map((banner, index) => (
                      <SortableBannerItem
                        key={banner.id}
                        banner={banner}
                        index={index}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </CardContent>
        </Card>

        {hasChanges && (
          <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-4">
            <p className="text-sm text-orange-800">
              ⚠️ Bạn có thay đổi chưa lưu. Nhấn <strong>Lưu thay đổi</strong> để áp dụng thứ tự mới.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
