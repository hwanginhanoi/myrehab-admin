'use client'

import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, ChevronLeft, ChevronRight, Save } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getPublicImageUrl } from '@/lib/file-upload'
import { useGetAllBanners, useUpdateBanner, type BannerResponse } from '@/api'

// Sortable item component
function SortableBannerItem({
  banner,
  index,
}: {
  banner: BannerResponse
  index: number
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: banner.id! })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const imageUrl = banner.imageUrl ? getPublicImageUrl(banner.imageUrl) : null

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-4 rounded-lg border bg-card p-4',
        isDragging && 'opacity-50 shadow-lg',
        !banner.isActive && 'opacity-60 bg-muted'
      )}
    >
      <button
        className='cursor-grab touch-none'
        {...attributes}
        {...listeners}
      >
        <GripVertical className='h-5 w-5 text-muted-foreground' />
      </button>

      <div className='flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm'>
        {index + 1}
      </div>

      {imageUrl ? (
        <img
          src={imageUrl}
          alt={banner.title || 'Banner'}
          className='w-24 h-14 object-cover rounded'
        />
      ) : (
        <div className='w-24 h-14 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground'>
          No image
        </div>
      )}

      <div className='flex-1 min-w-0'>
        <p className='font-medium truncate'>{banner.title}</p>
        <p className='text-sm text-muted-foreground truncate'>
          {banner.description || 'Không có mô tả'}
        </p>
      </div>

      <Badge variant={banner.isActive ? 'default' : 'secondary'}>
        {banner.isActive ? 'Đang hiển thị' : 'Đã tắt'}
      </Badge>
    </div>
  )
}

// Banner preview carousel
function BannerPreview({ banners }: { banners: BannerResponse[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Filter only active banners for preview
  const activeBanners = useMemo(
    () => banners.filter((b) => b.isActive),
    [banners]
  )

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? activeBanners.length - 1 : prev - 1
    )
  }

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === activeBanners.length - 1 ? 0 : prev + 1
    )
  }

  // Auto-advance carousel
  useEffect(() => {
    if (activeBanners.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === activeBanners.length - 1 ? 0 : prev + 1
      )
    }, 3000)
    return () => clearInterval(interval)
  }, [activeBanners.length])

  // Reset index when banners change
  useEffect(() => {
    if (currentIndex >= activeBanners.length) {
      setCurrentIndex(0)
    }
  }, [activeBanners.length, currentIndex])

  if (activeBanners.length === 0) {
    return (
      <div className='w-full aspect-[16/6] bg-muted rounded-lg flex items-center justify-center'>
        <p className='text-muted-foreground'>Không có banner đang hiển thị</p>
      </div>
    )
  }

  const currentBanner = activeBanners[currentIndex]
  const imageUrl = currentBanner?.imageUrl
    ? getPublicImageUrl(currentBanner.imageUrl)
    : null

  return (
    <div className='relative w-full aspect-[16/6] bg-muted rounded-lg overflow-hidden'>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={currentBanner?.title || 'Banner'}
          className='w-full h-full object-cover'
        />
      ) : (
        <div className='w-full h-full flex items-center justify-center'>
          <p className='text-muted-foreground'>No image</p>
        </div>
      )}

      {/* Overlay with title */}
      <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4'>
        <p className='text-white font-semibold text-lg'>
          {currentBanner?.title}
        </p>
        {currentBanner?.description && (
          <p className='text-white/80 text-sm'>{currentBanner.description}</p>
        )}
      </div>

      {/* Navigation buttons */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className='absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors'
          >
            <ChevronLeft className='h-6 w-6' />
          </button>
          <button
            onClick={handleNext}
            className='absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors'
          >
            <ChevronRight className='h-6 w-6' />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {activeBanners.length > 1 && (
        <div className='absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2'>
          {activeBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                idx === currentIndex ? 'bg-white' : 'bg-white/50'
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function BannerReorderPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [banners, setBanners] = useState<BannerResponse[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Fetch all banners
  const { data: response, isLoading } = useGetAllBanners({
    pageable: {
      page: 0,
      size: 1000,
      sort: ['displayOrder,asc'],
    },
  })

  // Initialize banners state when data loads
  useEffect(() => {
    if (response?.content) {
      setBanners(response.content as BannerResponse[])
    }
  }, [response?.content])

  const updateMutation = useUpdateBanner({
    mutation: {
      onError: (error) => {
        toast.error('Lỗi khi cập nhật thứ tự: ' + error.message)
      },
    },
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setBanners((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        const newItems = arrayMove(items, oldIndex, newIndex)
        setHasChanges(true)
        return newItems
      })
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Update each banner with new displayOrder
      const updatePromises = banners.map((banner, index) =>
        updateMutation.mutateAsync({
          id: banner.id!,
          data: {
            title: banner.title || '',
            description: banner.description,
            linkUrl: banner.linkUrl,
            displayOrder: index + 1,
            imageUrl: banner.imageUrl || '',
            isActive: banner.isActive ?? true,
            startDate: banner.startDate,
            endDate: banner.endDate,
          },
        })
      )

      await Promise.all(updatePromises)
      toast.success('Đã lưu thứ tự banner thành công')
      setHasChanges(false)
      void queryClient.invalidateQueries({ queryKey: [{ url: '/api/banners' }] })
    } catch {
      toast.error('Có lỗi xảy ra khi lưu thứ tự')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <p className='text-muted-foreground'>Đang tải...</p>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Sắp xếp thứ tự Banner</h2>
          <p className='text-muted-foreground'>
            Kéo thả để sắp xếp thứ tự hiển thị banner trên ứng dụng.
          </p>
        </div>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            onClick={() => navigate({ to: '/banners' })}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? 'Đang lưu...' : 'Lưu thứ tự'}
            {!isSaving && <Save className='ml-2 h-4 w-4' />}
          </Button>
        </div>
      </div>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Xem trước Banner</CardTitle>
        </CardHeader>
        <CardContent>
          <BannerPreview banners={banners} />
          <p className='text-sm text-muted-foreground mt-3'>
            * Chỉ hiển thị các banner đang bật. Banner đã tắt sẽ bị bỏ qua trong danh sách hiển thị.
          </p>
        </CardContent>
      </Card>

      {/* Reorder Section */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Banner</CardTitle>
        </CardHeader>
        <CardContent>
          {banners.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground'>
              Chưa có banner nào. Hãy tạo banner mới trước.
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
                <div className='space-y-2'>
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
    </div>
  )
}
