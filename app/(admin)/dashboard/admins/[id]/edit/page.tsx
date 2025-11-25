'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { getAdminById } from '@/api/api/adminManagementControllerController/getAdminById';
import { updateAdmin } from '@/api/api/adminManagementControllerController/updateAdmin';
import { AdminResponse } from '@/api/types/AdminResponse';
import { UpdateAdminRequest } from '@/api/types/UpdateAdminRequest';
import { AdminFormFields } from '@/components/admin-creation/admin-form-fields';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { toast } from 'sonner';

export default function EditAdminPage() {
  const router = useRouter();
  const params = useParams();
  const [admin, setAdmin] = useState<AdminResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string>('');

  const adminId = params.id as string;

  const form = useForm<UpdateAdminRequest>({
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      description: '',
      department: '',
      enabled: true,
      permissions: [],
    },
  });

  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (!adminId) return;

    const fetchAdmin = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAdminById(Number(adminId));
        setAdmin(data);

        // Reset form with fetched data
        reset({
          fullName: data.fullName || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          description: data.description || '',
          department: data.department || '',
          enabled: data.enabled ?? true,
          permissions: data.permissions || [],
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch admin';
        setError(errorMessage);
        toast.error('Failed to load admin', {
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    void fetchAdmin();
  }, [adminId, reset]);

  const onSubmit = async (data: UpdateAdminRequest) => {
    // Validate permissions
    if (!data.permissions || data.permissions.length === 0) {
      setPermissionError('Vui lòng chọn ít nhất một quyền');
      toast.error('Vui lòng chọn ít nhất một quyền');
      return;
    }

    setPermissionError('');
    setIsSubmitting(true);
    try {
      const requestData: UpdateAdminRequest = {
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        phoneNumber: data.phoneNumber?.trim() || undefined,
        description: data.description?.trim() || undefined,
        password: data.password?.trim() || undefined,
        department: data.department?.trim() || undefined,
        enabled: data.enabled,
        permissions: data.permissions,
      };

      await updateAdmin(Number(adminId), requestData);

      toast.success('Cập nhật thông tin quản trị viên thành công');
      router.push(`/dashboard/admins/${adminId}`);
    } catch (error) {
      console.error('Error updating admin:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thông tin quản trị viên');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/admins/`);
  };

  if (loading) {
    return <LoadingState message="Đang tải thông tin quản trị viên..." />;
  }

  if (error || !admin) {
    return <ErrorState error={error || 'Không tìm thấy quản trị viên'} onBack={() => router.back()} />;
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Back Button */}
      <div className="m-9 mt-9 mb-6">
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="border-[#6DBAD6] text-[#6DBAD6] hover:bg-[#6DBAD6] hover:text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </Button>
      </div>

      {/* Main Content */}
      <div className="m-9 mt-0 mb-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Chỉnh sửa thông tin quản trị viên</h1>
              <p className="text-base text-[#71717A]">
                Chỉnh sửa thông tin: {admin.fullName}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <AdminFormFields form={form} disabled={isSubmitting} isEdit permissionError={permissionError} />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#6DBAD6] text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-sm hover:bg-[#6DBAD6]/90 w-28"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Đang lưu...' : 'Lưu'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="border-[#6DBAD6] text-[#6DBAD6] hover:bg-[#6DBAD6] hover:text-white px-4 py-2 rounded-md"
            >
              Hủy
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
