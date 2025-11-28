'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { FileUpload } from '@/components/file-upload/file-upload';
import { createBanner } from '@/api/api/carouselBannerManagementController/createBanner';
import type { CreateCarouselBannerRequest } from '@/api/types/CreateCarouselBannerRequest';
import { toast } from 'sonner';

export default function CreateBannerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<CreateCarouselBannerRequest>({
    defaultValues: {
      displayOrder: 0,
    },
  });

  const imageUrl = watch('imageUrl');

  const onSubmit = async (data: CreateCarouselBannerRequest) => {
    if (!data.imageUrl) {
      setError('imageUrl', {
        type: 'manual',
        message: 'Vui lòng tải lên hình ảnh banner',
      });
      toast.error('Vui lòng tải lên hình ảnh banner');
      return;
    }

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
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#EF7F26]">Hình ảnh</CardTitle>
                <CardDescription>Tải lên hình ảnh banner</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-medium text-[#09090B]">
                    Tải lên ảnh <span className="text-red-500">*</span>
                  </Label>
                  <FileUpload
                    onUploadCompleteAction={(fileUrl) => setValue('imageUrl', fileUrl)}
                    acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                    fileType="image"
                    category="banner"
                    maxFileSize={10}
                    disabled={loading}
                    compact={true}
                  />
                  {errors.imageUrl && (
                    <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
                  )}
                  {imageUrl && (
                    <p className="text-xs text-green-600">✓ Hình ảnh đã được tải lên thành công</p>
                  )}
                </div>
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
