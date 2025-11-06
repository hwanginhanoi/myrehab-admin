'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserCompanyInfo } from '@/api/api/userManagementController/getUserCompanyInfo';
import type { UserCompanyInfoResponse } from '@/api/types/UserCompanyInfoResponse';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, MapPin, AlertCircle, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface UserCompanyInfoTabProps {
  userId: string;
}

export function UserCompanyInfoTab({ userId }: UserCompanyInfoTabProps) {
  const [companyInfo, setCompanyInfo] = useState<UserCompanyInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        const data = await getUserCompanyInfo(Number(userId));
        setCompanyInfo(data);
      } catch (err) {
        if (err instanceof Error && err.message.includes('404')) {
          setNotFound(true);
        } else {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch company info';
          toast.error('Failed to load company information', {
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
          Người dùng này chưa cập nhật thông tin công ty.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#EF7F26] flex items-center gap-2">
          <Building2 className="h-6 w-6" />
          Thông tin công ty
        </CardTitle>
        <CardDescription>Thông tin về công ty và vị trí công việc</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <Building2 className="h-5 w-5 text-[#6DBAD6] mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#71717A]">Tên công ty</p>
              <p className="text-base font-semibold">{companyInfo?.companyName || 'Chưa cập nhật'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-[#6DBAD6] mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#71717A]">Mã số thuế</p>
              <p className="text-base font-semibold">{companyInfo?.companyTaxNumber || 'Chưa cập nhật'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 md:col-span-2">
            <MapPin className="h-5 w-5 text-[#6DBAD6] mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#71717A]">Địa chỉ xuất hóa đơn</p>
              <p className="text-base font-semibold">{companyInfo?.invoiceIssuanceAddress || 'Chưa cập nhật'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
