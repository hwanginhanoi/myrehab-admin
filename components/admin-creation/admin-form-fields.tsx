import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreateAdminRequest } from '@/api/types/CreateAdminRequest';
import { PermissionSelector } from '@/components/permissions/permission-selector';

interface AdminFormFieldsProps {
  form: UseFormReturn<CreateAdminRequest>;
  disabled?: boolean;
  isEdit?: boolean;
  permissionError?: string;
}

export function AdminFormFields({ form, disabled = false, isEdit = false, permissionError }: AdminFormFieldsProps) {
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
            placeholder="Nhập họ và tên quản trị viên"
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
        {/* Department Input */}
        <div className="space-y-2">
          <Label htmlFor="department" className="text-sm font-medium">
            Phòng ban
          </Label>
          <Input
            id="department"
            placeholder="Nhập phòng ban (tùy chọn)"
            {...register('department')}
            disabled={disabled}
            className="w-full"
          />
        </div>

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
      </div>

      {/* Description Input */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Mô tả
        </Label>
        <Input
            id="description"
            placeholder="Nhập mô tả (tùy chọn)"
            {...register('description')}
            disabled={disabled}
            className="w-full"
        />
      </div>

      {/* Permission Selector */}
      <PermissionSelector
        selectedPermissions={watch('permissions') || []}
        onChange={(permissions) => setValue('permissions', permissions)}
        disabled={disabled}
        error={permissionError}
      />
    </div>
  );
}
