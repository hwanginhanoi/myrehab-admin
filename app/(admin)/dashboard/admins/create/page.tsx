'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { createAdmin } from '@/api/api/adminManagementControllerController/createAdmin';
import type { CreateAdminRequest } from '@/api/types/CreateAdminRequest';
import { AdminFormFields } from '@/components/admin-creation/admin-form-fields';

export default function CreateAdminPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [permissionError, setPermissionError] = useState<string>('');

  const form = useForm<CreateAdminRequest>({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      department: '',
      permissions: [],
    },
  });

  const { handleSubmit } = form;

  const onSubmit = async (data: CreateAdminRequest) => {
    // Validate permissions
    if (!data.permissions || data.permissions.length === 0) {
      setPermissionError('Vui lòng chọn ít nhất một quyền');
      toast.error('Vui lòng chọn ít nhất một quyền');
      return;
    }

    setPermissionError('');
    setIsSubmitting(true);
    try {
      const requestData: CreateAdminRequest = {
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        password: data.password,
        department: data.department?.trim() || undefined,
        permissions: data.permissions,
      };

      await createAdmin(requestData);

      toast.success('Tạo tài khoản quản trị viên thành công');
      router.push('/dashboard/admins');
    } catch (error) {
      console.error('Error creating admin:', error);
      toast.error('Có lỗi xảy ra khi tạo tài khoản quản trị viên');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/admins');
  };

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
              <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Tạo tài khoản quản trị viên mới</h1>
              <p className="text-base text-[#71717A]">Thêm quản trị viên mới vào hệ thống</p>
            </div>
          </div>

          {/* Form Fields */}
          <AdminFormFields form={form} disabled={isSubmitting} permissionError={permissionError} />

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
