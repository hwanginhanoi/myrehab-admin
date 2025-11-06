'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Power, PowerOff, Calendar, Link as LinkIcon, Hash, Image as ImageIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { getBannerById } from '@/api/api/carouselBannerManagementController/getBannerById';
import { deleteBanner } from '@/api/api/carouselBannerManagementController/deleteBanner';
import { toggleBannerStatus } from '@/api/api/carouselBannerManagementController/toggleBannerStatus';
import type { CarouselBannerResponse } from '@/api/types/CarouselBannerResponse';
import { toast } from 'sonner';

export default function BannerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bannerId = params.id as string;
  const [banner, setBanner] = useState<CarouselBannerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const fetchBanner = async () => {
    try {
      setLoading(true);
      const data = await getBannerById(Number(bannerId));
      setBanner(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch banner';
      toast.error('Failed to load banner', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bannerId) {
      fetchBanner();
    }
  }, [bannerId]);

  const handleDelete = async () => {
    try {
      await deleteBanner(Number(bannerId), {});
      toast.success('Banner đã được xóa thành công');
      router.push('/dashboard/banners');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete banner';
      toast.error('Failed to delete banner', {
        description: errorMessage,
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!banner) return;
    try {
      await toggleBannerStatus(Number(bannerId), { isActive: !(banner.isActive ?? false) });
      toast.success('Trạng thái banner đã được cập nhật');
      fetchBanner();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle banner status';
      toast.error('Failed to toggle status', {
        description: errorMessage,
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Không giới hạn';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="m-9 mt-9">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!banner) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="text-lg text-muted-foreground">Banner không tồn tại</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="m-9 mt-9">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-[#6DBAD6] hover:text-[#6DBAD6] hover:bg-[#6DBAD6]/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">
                Chi tiết banner
              </h1>
              <p className="text-base text-[#71717A]">
                Xem thông tin chi tiết banner #{bannerId}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleToggleStatus}
                className="border-[#6DBAD6] text-[#6DBAD6] hover:bg-[#6DBAD6] hover:text-white"
              >
                {banner.isActive ? (
                  <>
                    <PowerOff className="mr-2 h-4 w-4" />
                    Tắt
                  </>
                ) : (
                  <>
                    <Power className="mr-2 h-4 w-4" />
                    Bật
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/dashboard/banners/${bannerId}/edit`)}
                className="border-[#6DBAD6] text-[#6DBAD6] hover:bg-[#6DBAD6] hover:text-white"
              >
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Button>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(true)}
                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </Button>
            </div>
          </div>
        </div>

        {/* Banner Image */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-[#EF7F26]">Hình ảnh Banner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden aspect-[21/9] bg-gray-100">
              {banner.imageUrl ? (
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-image.png';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#EF7F26]">Thông tin cơ bản</CardTitle>
              <CardDescription>Chi tiết về banner</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-[#71717A] mb-1">Tiêu đề</p>
                <p className="text-base font-semibold">{banner.title || 'N/A'}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-[#71717A] mb-1">Mô tả</p>
                <p className="text-base">{banner.description || 'Không có mô tả'}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-[#71717A] mb-1">Link URL</p>
                {banner.linkUrl ? (
                  <a
                    href={banner.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-[#6DBAD6] hover:underline flex items-center gap-1"
                  >
                    <LinkIcon className="h-4 w-4" />
                    {banner.linkUrl}
                  </a>
                ) : (
                  <p className="text-base text-muted-foreground">Không có link</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Hash className="h-5 w-5 text-[#6DBAD6]" />
                <div>
                  <p className="text-sm font-medium text-[#71717A]">Thứ tự hiển thị</p>
                  <p className="text-base font-semibold font-mono">{banner.displayOrder}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status & Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#EF7F26]">Trạng thái & Lịch trình</CardTitle>
              <CardDescription>Thông tin trạng thái và lịch hiển thị</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-[#71717A] mb-2">Trạng thái</p>
                <div className="flex gap-2">
                  <Badge variant={banner.isActive ? 'default' : 'secondary'}>
                    {banner.isActive ? 'Hoạt động' : 'Tắt'}
                  </Badge>
                  {banner.shouldDisplay && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Đang hiển thị
                    </Badge>
                  )}
                  {banner.isCurrentlyScheduled && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Trong lịch trình
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-[#6DBAD6] mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#71717A]">Ngày bắt đầu</p>
                  <p className="text-base">{formatDate(banner.startDate)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-[#6DBAD6] mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#71717A]">Ngày kết thúc</p>
                  <p className="text-base">{formatDate(banner.endDate)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-[#6DBAD6] mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#71717A]">Ngày tạo</p>
                  <p className="text-base">{formatDate(banner.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-[#6DBAD6] mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#71717A]">Ngày cập nhật</p>
                  <p className="text-base">{formatDate(banner.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Banner sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
