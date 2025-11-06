'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { getBannerById } from '@/api/api/carouselBannerManagementController/getBannerById';
import { updateBanner } from '@/api/api/carouselBannerManagementController/updateBanner';
import type { UpdateCarouselBannerRequest } from '@/api/types/UpdateCarouselBannerRequest';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditBannerPage() {
  const params = useParams();
  const router = useRouter();
  const bannerId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imagePreview, setImagePreview] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateCarouselBannerRequest>({
    defaultValues: {
      isActive: true,
    },
  });

  const imageUrl = watch('imageUrl');
  const isActive = watch('isActive');

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        setFetching(true);
        const data = await getBannerById(Number(bannerId));

        reset({
          title: data.title || '',
          description: data.description || '',
          imageUrl: data.imageUrl || '',
          linkUrl: data.linkUrl || '',
          displayOrder: data.displayOrder || 0,
          isActive: data.isActive ?? true,
          startDate: data.startDate ? new Date(data.startDate).toISOString().slice(0, 16) : undefined,
          endDate: data.endDate ? new Date(data.endDate).toISOString().slice(0, 16) : undefined,
        });

        if (data.imageUrl) {
          setImagePreview(data.imageUrl);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch banner';
        toast.error('Failed to load banner', {
          description: errorMessage,
        });
      } finally {
        setFetching(false);
      }
    };

    if (bannerId) {
      fetchBanner();
    }
  }, [bannerId, reset]);

  const onSubmit = async (data: UpdateCarouselBannerRequest) => {
    try {
      setLoading(true);
      await updateBanner(Number(bannerId), data);
      toast.success('Banner đã được cập nhật thành công');
      router.push('/dashboard/banners');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update banner';
      toast.error('Failed to update banner', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setValue('imageUrl', url);
    setImagePreview(url);
  };

  if (fetching) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="m-9 mt-9">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
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
          <div>
            <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">
              Chỉnh sửa banner
            </h1>
            <p className="text-base text-[#71717A]">
              Cập nhật thông tin banner #{bannerId}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#EF7F26]">Thông tin cơ bản</CardTitle>
                <CardDescription>Điền thông tin cơ bản của banner</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Tiêu đề <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    {...register('title', { required: 'Tiêu đề là bắt buộc' })}
                    placeholder="Nhập tiêu đề banner"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Nhập mô tả banner"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkUrl">Link URL</Label>
                  <Input
                    id="linkUrl"
                    {...register('linkUrl')}
                    placeholder="https://example.com"
                    type="url"
                  />
                  <p className="text-sm text-muted-foreground">
                    URL sẽ được mở khi người dùng click vào banner
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayOrder">
                    Thứ tự hiển thị <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    {...register('displayOrder', {
                      required: 'Thứ tự hiển thị là bắt buộc',
                      valueAsNumber: true,
                    })}
                    placeholder="0"
                  />
                  {errors.displayOrder && (
                    <p className="text-sm text-red-500">{errors.displayOrder.message}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Banner với thứ tự nhỏ hơn sẽ hiển thị trước
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={isActive}
                    onCheckedChange={(checked) => setValue('isActive', checked)}
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    Kích hoạt banner
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Image */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#EF7F26]">Hình ảnh</CardTitle>
                <CardDescription>Tải lên hình ảnh banner</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">
                    URL hình ảnh <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="imageUrl"
                      {...register('imageUrl', { required: 'URL hình ảnh là bắt buộc' })}
                      placeholder="https://example.com/image.jpg"
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                    />
                    <Button type="button" variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                  {errors.imageUrl && (
                    <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
                  )}
                </div>

                {/* Image Preview */}
                {(imagePreview || imageUrl) && (
                  <div className="space-y-2">
                    <Label>Xem trước</Label>
                    <div className="border rounded-lg overflow-hidden aspect-[21/9] bg-gray-100">
                      <img
                        src={imagePreview || imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-image.png';
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#EF7F26]">Lịch hiển thị</CardTitle>
                <CardDescription>
                  Thiết lập thời gian hiển thị banner (không bắt buộc)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Ngày bắt đầu</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      {...register('startDate')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">Ngày kết thúc</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      {...register('endDate')}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Để trống nếu muốn banner hiển thị vô thời hạn
                </p>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#6DBAD6] hover:bg-[#5ca9c5] text-white"
              >
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Đang lưu...' : 'Cập nhật banner'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Hủy
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
