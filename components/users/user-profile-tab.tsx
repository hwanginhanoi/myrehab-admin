'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserProfile } from '@/api/api/userManagementController/getUserProfile';
import { getUserBasicInfo } from '@/api/api/userManagementController/getUserBasicInfo';
import type { UserProfileResponse } from '@/api/types/UserProfileResponse';
import type { UserBasicInfoResponse } from '@/api/types/UserBasicInfoResponse';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Mail, Phone, Calendar, MapPin, Users, Cake, IdCard } from 'lucide-react';

interface UserProfileTabProps {
  userId: string;
}

export function UserProfileTab({ userId }: UserProfileTabProps) {
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [basicInfo, setBasicInfo] = useState<UserBasicInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileData, basicInfoData] = await Promise.all([
          getUserProfile(Number(userId)),
          getUserBasicInfo(Number(userId)),
        ]);
        setProfile(profileData);
        setBasicInfo(basicInfoData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile data';
        toast.error('Failed to load profile', {
          description: errorMessage,
        });
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
            {Array.from({ length: 8 }).map((_, i) => (
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#EF7F26]">Thông tin cơ bản</CardTitle>
          <CardDescription>Thông tin cá nhân của người dùng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-[#6DBAD6] mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#71717A]">Họ và tên</p>
                <p className="text-base font-semibold">{basicInfo?.fullName || 'Chưa cập nhật'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-[#6DBAD6] mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#71717A]">Email</p>
                <p className="text-base font-semibold">{basicInfo?.email || 'Chưa cập nhật'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-[#6DBAD6] mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#71717A]">Số điện thoại</p>
                <p className="text-base font-semibold">{basicInfo?.phoneNumber || 'Chưa cập nhật'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-[#6DBAD6] mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#71717A]">Địa chỉ</p>
                <p className="text-base font-semibold">{profile?.address || 'Chưa cập nhật'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#EF7F26]">Hồ sơ chi tiết</CardTitle>
          <CardDescription>Thông tin chi tiết về hồ sơ người dùng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Cake className="h-5 w-5 text-[#6DBAD6] mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#71717A]">Ngày sinh</p>
                <p className="text-base font-semibold">{formatDate(basicInfo?.dateOfBirth)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-[#6DBAD6] mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#71717A]">Giới tính</p>
                <p className="text-base font-semibold">
                  {basicInfo?.gender === 'MALE' ? 'Nam' : basicInfo?.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <IdCard className="h-5 w-5 text-[#6DBAD6] mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#71717A]">CCCD/CMND</p>
                <p className="text-base font-semibold">{profile?.vietnameseIdentityCard || 'Chưa cập nhật'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-[#6DBAD6] mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#71717A]">Nghề nghiệp</p>
                <p className="text-base font-semibold">{profile?.jobTitle || 'Chưa cập nhật'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-[#6DBAD6] mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#71717A]">Quốc tịch</p>
                <p className="text-base font-semibold">{profile?.nationality || 'Chưa cập nhật'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-[#6DBAD6] mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#71717A]">Dân tộc</p>
                <p className="text-base font-semibold">{profile?.ethnic || 'Chưa cập nhật'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 md:col-span-2">
              <Calendar className="h-5 w-5 text-[#6DBAD6] mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#71717A]">Ngày tạo</p>
                <p className="text-base font-semibold">{formatDate(profile?.createdAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
