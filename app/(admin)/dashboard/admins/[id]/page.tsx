'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Shield, Settings, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { getAdminById } from '@/api/api/adminManagementControllerController/getAdminById';
import { AdminResponse } from '@/api/types/AdminResponse';

export default function AdminDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const adminId = params.id ? parseInt(params.id as string, 10) : null;

  const [admin, setAdmin] = useState<AdminResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminDetails = useCallback(async () => {
    if (!adminId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getAdminById(adminId);
      setAdmin(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch admin data';
      toast.error('Không thể tải thông tin quản trị viên', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, [adminId]);

  useEffect(() => {
    fetchAdminDetails();
  }, [fetchAdminDetails]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="m-9 mt-9">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">
                Chi tiết quản trị viên
              </h1>
              <p className="text-base text-[#71717A]">
                Xem và quản lý thông tin chi tiết của quản trị viên #{adminId}
              </p>
            </div>
            <Button
              onClick={() => router.push(`/dashboard/admins/${adminId}/edit`)}
              className="bg-[#6DBAD6] hover:bg-[#5BA8C4] text-white"
            >
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
          </div>
        </div>

        {/* Admin Quick Info */}
        {admin && (
          <div className="bg-white border rounded-lg p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-[#6DBAD6]/10 flex items-center justify-center">
                <User className="h-8 w-8 text-[#6DBAD6]" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{admin.fullName || 'N/A'}</h2>
                <p className="text-[#71717A]">{admin.email || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Information Cards */}
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#020617] flex items-center gap-2">
                <User className="w-5 h-5 text-[#6DBAD6]" />
                Thông tin cơ bản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">ID</label>
                  <p className="text-base font-medium text-[#020617]">{admin?.id || '-'}</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Họ và tên</label>
                  <p className="text-base font-medium text-[#020617]">{admin?.fullName || '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Email</label>
                  <p className="text-base font-medium text-[#020617]">{admin?.email || '-'}</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Phòng ban</label>
                  <p className="text-base font-medium text-[#020617]">{admin?.department || '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Số điện thoại</label>
                  <p className="text-base font-medium text-[#020617]">{admin?.phoneNumber || '-'}</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Mô tả</label>
                  <p className="text-base font-medium text-[#020617]">{admin?.description || '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Trạng thái</label>
                  <div>
                    <span className={`inline-block px-2 py-1 rounded-md text-sm ${
                      admin?.enabled
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {admin?.enabled ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-base font-medium text-[#939598]">Ngày tạo</label>
                  <p className="text-base font-medium text-[#020617]">{formatDate(admin?.createdAt)}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-base font-medium text-[#939598]">Cập nhật lần cuối</label>
                <p className="text-base font-medium text-[#020617]">{formatDate(admin?.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-[#020617] flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#6DBAD6]" />
                  Quyền hạn
                </CardTitle>
                <Button
                  size="sm"
                  onClick={() => router.push(`/dashboard/admins/${adminId}/permissions`)}
                  className="bg-[#6DBAD6] hover:bg-[#5BA8C4] text-white"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Quản lý quyền
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {admin?.permissions && admin.permissions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {admin.permissions.map((permission, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-medium"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[#71717A] text-sm">Chưa có quyền nào được gán</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
