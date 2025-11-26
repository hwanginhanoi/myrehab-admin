import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CreateDoctorRequest } from '@/api/types/CreateDoctorRequest';
import { UpdateDoctorRequest } from '@/api/types/UpdateDoctorRequest';
import { PermissionSelector } from '@/components/permissions/permission-selector';
import { FileUpload } from '@/components/file-upload/file-upload';

interface DoctorFormFieldsProps {
  form: UseFormReturn<CreateDoctorRequest> | UseFormReturn<UpdateDoctorRequest>;
  disabled?: boolean;
  isEdit?: boolean;
  permissionError?: string;
}

export function DoctorFormFields({ form, disabled = false, isEdit = false, permissionError }: DoctorFormFieldsProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name Input */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium">
            Họ và tên *
          </Label>
          <Input
            id="fullName"
            placeholder="Nhập họ và tên bác sĩ"
            {...register('fullName', {
              required: 'Họ và tên là bắt buộc',
              minLength: {
                value: 1,
                message: 'Họ và tên không được để trống',
              },
            })}
            disabled={disabled}
            className="w-full"
          />
          {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Nhập email"
            {...register('email', {
              required: 'Email là bắt buộc',
              minLength: {
                value: 1,
                message: 'Email không được để trống',
              },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email không hợp lệ',
              },
            })}
            disabled={disabled}
            className="w-full"
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>
      </div>

      {/* Password Input - only show when creating */}
      {!isEdit && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Mật khẩu *
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
              {...register('password', {
                required: 'Mật khẩu là bắt buộc',
                minLength: {
                  value: 6,
                  message: 'Mật khẩu phải có ít nhất 6 ký tự',
                },
              })}
              disabled={disabled}
              className="w-full"
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Specialization Input */}
        <div className="space-y-2">
          <Label htmlFor="specialization" className="text-sm font-medium">
            Chuyên khoa
          </Label>
          <Input
            id="specialization"
            placeholder="Nhập chuyên khoa (tùy chọn)"
            {...register('specialization')}
            disabled={disabled}
            className="w-full"
          />
        </div>

        {/* License Number Input */}
        <div className="space-y-2">
          <Label htmlFor="licenseNumber" className="text-sm font-medium">
            Số giấy phép
          </Label>
          <Input
            id="licenseNumber"
            placeholder="Nhập số giấy phép (tùy chọn)"
            {...register('licenseNumber')}
            disabled={disabled}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phone Number Input */}
        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="text-sm font-medium">
            Số điện thoại
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="Nhập số điện thoại (tùy chọn)"
            {...register('phoneNumber')}
            disabled={disabled}
            className="w-full"
          />
        </div>

        {/* Other Name Input */}
        <div className="space-y-2">
          <Label htmlFor="otherName" className="text-sm font-medium">
            Tên khác
          </Label>
          <Input
            id="otherName"
            placeholder="Nhập tên khác (tùy chọn)"
            {...register('otherName')}
            disabled={disabled}
            className="w-full"
          />
        </div>
      </div>

      {/* Description Textarea */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Mô tả
        </Label>
        <Textarea
          id="description"
          placeholder="Nhập mô tả về bác sĩ (tùy chọn)"
          {...register('description')}
          disabled={disabled}
          className="w-full min-h-[100px]"
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Ảnh đại diện</Label>
        <div className="max-w-md">
          <FileUpload
            onUploadCompleteAction={(fileUrl) => setValue('imageUrl', fileUrl)}
            acceptedTypes={['image/*']}
            fileType="image"
            category="profile"
            maxFileSize={5}
            disabled={disabled}
            className="[&_.aspect-video]:aspect-square [&_.aspect-video]:max-h-64"
          />
        </div>
      </div>

      {/* Permission Selector */}
      <PermissionSelector
        selectedPermissions={(watch('permissions') as string[] | undefined) || []}
        onChange={(permissions) => setValue('permissions', permissions as any)}
        disabled={disabled}
        error={permissionError}
      />
    </div>
  );
}
