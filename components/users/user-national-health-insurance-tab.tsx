'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getNationalHealthInsurance } from '@/api/api/userManagementController/getNationalHealthInsurance';
import type { NationalHealthInsuranceResponse } from '@/api/types/NationalHealthInsuranceResponse';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, CreditCard, Calendar, MapPin, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface UserNationalHealthInsuranceTabProps {
  userId: string;
}

export function UserNationalHealthInsuranceTab({ userId }: UserNationalHealthInsuranceTabProps) {
  const [insurance, setInsurance] = useState<NationalHealthInsuranceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        const data = await getNationalHealthInsurance(Number(userId));
        setInsurance(data);
      } catch (err) {
        if (err instanceof Error && err.message.includes('404')) {
          setNotFound(true);
        } else {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch insurance data';
          toast.error('Failed to load national health insurance', {
            description: errorMessage,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (notFound) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Không có thông tin</AlertTitle>
        <AlertDescription>
          Người dùng này chưa cập nhật thông tin bảo hiểm y tế quốc gia.
        </AlertDescription>
      </Alert>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#EF7F26] flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Bảo hiểm y tế quốc gia
        </CardTitle>
        <CardDescription>Thông tin bảo hiểm y tế bắt buộc</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <CreditCard className="h-5 w-5 text-[#6DBAD6] mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#71717A]">Số thẻ BHYT</p>
              <p className="text-base font-semibold font-mono">{insurance?.insuranceNumber || 'Chưa cập nhật'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-[#6DBAD6] mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#71717A]">Nơi đăng ký</p>
              <p className="text-base font-semibold">{insurance?.placeOfRegistration || 'Chưa cập nhật'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-[#6DBAD6] mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#71717A]">Ngày tạo</p>
              <p className="text-base font-semibold">{formatDate(insurance?.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-[#6DBAD6] mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#71717A]">Ngày cập nhật</p>
              <p className="text-base font-semibold">{formatDate(insurance?.updatedAt)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
