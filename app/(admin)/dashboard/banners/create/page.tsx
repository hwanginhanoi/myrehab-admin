'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { createBanner } from '@/api/api/carouselBannerManagementController/createBanner';
import type { CreateCarouselBannerRequest } from '@/api/types/CreateCarouselBannerRequest';
import { toast } from 'sonner';

export default function CreateBannerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateCarouselBannerRequest>({
    defaultValues: {
      displayOrder: 0,
    },
  });

  const imageUrl = watch('imageUrl');

  const onSubmit = async (data: CreateCarouselBannerRequest) => {
    try {
      setLoading(true);
      await createBanner(data);
      toast.success('Banner đã được tạo thành công');
      router.push('/dashboard/banners');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create banner';
      toast.error('Failed to create banner', {
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
              Tạo banner mới
            </h1>
            <p className="text-base text-[#71717A]">
              Thêm banner carousel mới cho trang chủ
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
                {loading ? 'Đang lưu...' : 'Tạo banner'}
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
