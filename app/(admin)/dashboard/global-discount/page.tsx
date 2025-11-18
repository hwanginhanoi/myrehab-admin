'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Percent, Info, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getGlobalDiscount } from '@/api/api/globalDiscountManagementController/getGlobalDiscount';
import { updateGlobalDiscount } from '@/api/api/globalDiscountManagementController/updateGlobalDiscount';
import { GlobalDiscountResponse } from '@/api/types/GlobalDiscountResponse';
import { UpdateGlobalDiscountRequest } from '@/api/types/UpdateGlobalDiscountRequest';

type FormData = {
  discountPercentage: number;
  isActive: boolean;
};

export default function GlobalDiscountPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentSettings, setCurrentSettings] = useState<GlobalDiscountResponse | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    defaultValues: {
      discountPercentage: 0,
      isActive: false,
    },
  });

  const isActive = watch('isActive');
  const discountPercentage = watch('discountPercentage');

  // Fetch current settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await getGlobalDiscount();
        setCurrentSettings(data);
        reset({
          discountPercentage: data.discountPercentage || 0,
          isActive: data.isActive || false,
        });
      } catch (err) {
        console.error('Failed to fetch global discount:', err);
        toast.error('Lỗi khi tải cài đặt giảm giá', {
          description: err instanceof Error ? err.message : 'Không thể tải cài đặt giảm giá toàn cục.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    try {
      setSaving(true);

      const requestData: UpdateGlobalDiscountRequest = {
        discountPercentage: data.discountPercentage,
        isActive: data.isActive,
      };

      const updatedData = await updateGlobalDiscount(requestData);
      setCurrentSettings(updatedData);
      reset(data); // Reset form dirty state

      toast.success('Cài đặt đã được lưu thành công!', {
        description: data.isActive
          ? `Giảm giá ${data.discountPercentage}% đã được kích hoạt.`
          : 'Giảm giá toàn cục đã được tắt.',
      });
    } catch (err) {
      console.error('Failed to update global discount:', err);
      toast.error('Lỗi khi lưu cài đặt', {
        description: err instanceof Error ? err.message : 'Không thể cập nhật cài đặt giảm giá.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (currentSettings) {
      reset({
        discountPercentage: currentSettings.discountPercentage || 0,
        isActive: currentSettings.isActive || false,
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="m-9 mt-9 mb-6">
          <Skeleton className="h-12 w-96 mb-2" />
          <Skeleton className="h-6 w-64 mb-8" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="m-9 mt-9 mb-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Giảm giá toàn cục</h1>
          <p className="text-base text-[#71717A]">
            Quản lý giảm giá áp dụng cho tất cả các khóa học trong hệ thống
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Current Status Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#6DBAD6]" />
                  Trạng thái hiện tại
                </CardTitle>
                <CardDescription>Cài đặt đang áp dụng cho hệ thống</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Active Status */}
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">Trạng thái:</span>
                  {currentSettings?.isActive ? (
                    <Badge className="bg-green-500 hover:bg-green-600">Đang hoạt động</Badge>
                  ) : (
                    <Badge variant="secondary">Tạm ngưng</Badge>
                  )}
                </div>

                {/* Current Percentage */}
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">Phần trăm giảm giá:</span>
                  <span className="text-lg font-bold text-[#6DBAD6]">
                    {currentSettings?.discountPercentage || 0}%
                  </span>
                </div>

                {/* Last Updated */}
                <div className="pt-3 border-t space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tạo lúc:</span>
                    <span>{formatDate(currentSettings?.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Cập nhật lần cuối:</span>
                    <span>{formatDate(currentSettings?.updatedAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settings Form Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5 text-[#6DBAD6]" />
                  Cài đặt giảm giá
                </CardTitle>
                <CardDescription>Cập nhật cài đặt giảm giá toàn cục</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Enable/Disable Toggle */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="isActive" className="cursor-pointer font-medium">
                      Kích hoạt giảm giá
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Áp dụng giảm giá cho tất cả khóa học
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={isActive}
                    onCheckedChange={(checked) => setValue('isActive', checked, { shouldDirty: true })}
                  />
                </div>

                {/* Discount Percentage Input */}
                <div className="space-y-2">
                  <Label htmlFor="discountPercentage" className="text-sm font-medium">
                    Phần trăm giảm giá <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="discountPercentage"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      placeholder="Nhập % giảm giá..."
                      disabled={!isActive}
                      {...register('discountPercentage', {
                        required: isActive ? 'Phần trăm giảm giá là bắt buộc' : false,
                        valueAsNumber: true,
                        min: { value: 0, message: 'Phần trăm phải từ 0-100' },
                        max: { value: 100, message: 'Phần trăm phải từ 0-100' },
                      })}
                      className="w-full pr-10"
                    />
                    <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  {errors.discountPercentage && (
                    <p className="text-sm text-red-500">{errors.discountPercentage.message}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={!isDirty || saving}
                    className="flex-1"
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={!isDirty || saving}
                    className="flex-1 bg-[#6DBAD6] text-white hover:bg-[#6DBAD6]/90"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Information Panel */}
          <Card className="border-[#6DBAD6]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#6DBAD6]">
                <Info className="h-5 w-5" />
                Cách hoạt động
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* How it works */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Giảm giá toàn cục</strong> sẽ tự động áp dụng cho tất cả các khóa học trong hệ thống.
                  Khi một khóa học có cả giảm giá riêng và giảm giá toàn cục, hệ thống sẽ <strong>tự động áp dụng
                  mức giảm giá cao hơn</strong> (có lợi hơn cho khách hàng).
                </AlertDescription>
              </Alert>

              {/* Example */}
              {isActive && discountPercentage > 0 && (
                <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                  <h4 className="font-semibold text-sm">Ví dụ tính toán:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Khóa học có giá gốc:</span>
                      <span className="font-semibold">500,000₫</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Giảm giá toàn cục ({discountPercentage}%):</span>
                      <span className="font-semibold text-[#6DBAD6]">
                        {(500000 * (100 - discountPercentage) / 100).toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-muted-foreground">Khách hàng tiết kiệm:</span>
                      <span className="font-bold text-red-600">
                        {(500000 * discountPercentage / 100).toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Important Notes */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Lưu ý quan trọng:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Giảm giá toàn cục áp dụng cho tất cả khóa học, không có ngoại lệ</li>
                  <li>Nếu khóa học đã có giảm giá riêng cao hơn, hệ thống sẽ ưu tiên giảm giá riêng</li>
                  <li>Khi tắt giảm giá toàn cục, các giảm giá riêng của từng khóa học vẫn được áp dụng</li>
                  <li>Thay đổi sẽ có hiệu lực ngay lập tức trên toàn hệ thống</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
