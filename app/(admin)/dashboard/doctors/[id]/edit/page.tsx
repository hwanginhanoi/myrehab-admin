'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { getDoctorById } from '@/api/api/doctorManagementControllerController/getDoctorById';
import { updateDoctor } from '@/api/api/doctorManagementControllerController/updateDoctor';
import { DoctorResponse } from '@/api/types/DoctorResponse';
import { UpdateDoctorRequest } from '@/api/types/UpdateDoctorRequest';
import { DoctorFormFields } from '@/components/doctor-creation/doctor-form-fields';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { toast } from 'sonner';

export default function EditDoctorPage() {
  const router = useRouter();
  const params = useParams();
  const [doctor, setDoctor] = useState<DoctorResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string>('');

  const doctorId = params.id as string;

  const form = useForm<UpdateDoctorRequest>({
    defaultValues: {
      fullName: '',
      email: '',
      specialization: '',
      licenseNumber: '',
      phoneNumber: '',
      otherName: '',
      description: '',
      imageUrl: '',
      enabled: true,
      permissions: [],
    },
  });

  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (!doctorId) return;

    const fetchDoctor = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDoctorById(Number(doctorId));
        setDoctor(data);

        // Reset form with fetched data
        reset({
          fullName: data.fullName || '',
          email: data.email || '',
          specialization: data.specialization || '',
          licenseNumber: data.licenseNumber || '',
          phoneNumber: data.phoneNumber || '',
          otherName: data.otherName || '',
          description: data.description || '',
          imageUrl: data.imageUrl || '',
          enabled: data.enabled ?? true,
          permissions: data.permissions || [],
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch doctor';
        setError(errorMessage);
        toast.error('Failed to load doctor', {
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    void fetchDoctor();
  }, [doctorId, reset]);

  const onSubmit = async (data: UpdateDoctorRequest) => {
    // Validate permissions
    if (!data.permissions || data.permissions.length === 0) {
      setPermissionError('Vui lòng chọn ít nhất một quyền');
      toast.error('Vui lòng chọn ít nhất một quyền');
      return;
    }

    setPermissionError('');
    setIsSubmitting(true);
    try {
      const requestData: UpdateDoctorRequest = {
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        password: data.password?.trim() || undefined,
        specialization: data.specialization?.trim() || undefined,
        licenseNumber: data.licenseNumber?.trim() || undefined,
        phoneNumber: data.phoneNumber?.trim() || undefined,
        otherName: data.otherName?.trim() || undefined,
        description: data.description?.trim() || undefined,
        imageUrl: data.imageUrl?.trim() || undefined,
        enabled: data.enabled,
        permissions: data.permissions,
      };

      await updateDoctor(Number(doctorId), requestData);

      toast.success('Cập nhật thông tin bác sĩ thành công');
      router.push(`/dashboard/doctors/${doctorId}`);
    } catch (error) {
      console.error('Error updating doctor:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thông tin bác sĩ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/doctors/`);
  };

  if (loading) {
    return <LoadingState message="Đang tải thông tin bác sĩ..." />;
  }

  if (error || !doctor) {
    return <ErrorState error={error || 'Không tìm thấy bác sĩ'} onBack={() => router.back()} />;
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
              <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">Chỉnh sửa thông tin bác sĩ</h1>
              <p className="text-base text-[#71717A]">
                Chỉnh sửa thông tin: {doctor.fullName}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <DoctorFormFields form={form} disabled={isSubmitting} isEdit permissionError={permissionError} />

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
