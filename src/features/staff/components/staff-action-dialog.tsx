'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { SelectDropdown } from '@/components/select-dropdown'
import { toast } from 'sonner'
import type { StaffResponse } from '@/api'
import { useCreateStaff, useUpdateStaff } from '@/api'
import { staffRoles } from '../data/staff-roles'

const formSchema = z
  .object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().optional(),
    fullName: z.string().min(1, 'Họ tên là bắt buộc'),
    staffType: z.enum(['DOCTOR', 'TRAINER', 'ADMIN', 'SUPER_ADMIN'], {
      required_error: 'Vai trò là bắt buộc',
    }),
    specialization: z.string().optional(),
    doctorId: z.string().optional(),
    isEdit: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.isEdit) return true
      return !!data.password && data.password.length >= 8
    },
    {
      message: 'Mật khẩu phải có ít nhất 8 ký tự',
      path: ['password'],
    }
  )
  .refine(
    (data) => {
      if (data.staffType === 'TRAINER' && !data.isEdit) {
        return !!data.doctorId && !isNaN(Number(data.doctorId))
      }
      return true
    },
    {
      message: 'ID bác sĩ là bắt buộc cho huấn luyện viên',
      path: ['doctorId'],
    }
  )

type StaffForm = z.infer<typeof formSchema>

type StaffActionDialogProps = {
  currentRow?: StaffResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StaffActionDialog({
  currentRow,
  open,
  onOpenChange,
}: StaffActionDialogProps) {
  const isEdit = !!currentRow
  const queryClient = useQueryClient()

  const form = useForm<StaffForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          email: currentRow.email || '',
          fullName: currentRow.fullName || '',
          staffType: currentRow.staffType as any,
          specialization: currentRow.specialization || '',
          doctorId: currentRow.doctorId?.toString() || '',
          password: '',
          isEdit,
        }
      : {
          email: '',
          fullName: '',
          staffType: 'DOCTOR',
          specialization: '',
          doctorId: '',
          password: '',
          isEdit,
        },
  })

  const createMutation = useCreateStaff({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [{ url: '/api/admin/staff' }] })
        toast.success('Đã thêm nhân viên mới')
        form.reset()
        onOpenChange(false)
      },
      onError: (error) => {
        toast.error(error.message || 'Không thể thêm nhân viên')
      },
    },
  })

  const updateMutation = useUpdateStaff({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [{ url: '/api/admin/staff' }] })
        toast.success('Đã cập nhật thông tin nhân viên')
        form.reset()
        onOpenChange(false)
      },
      onError: (error) => {
        toast.error(error.message || 'Không thể cập nhật nhân viên')
      },
    },
  })

  const onSubmit = (values: StaffForm) => {
    const payload = {
      email: values.email,
      fullName: values.fullName,
      staffType: values.staffType,
      ...(values.specialization && { specialization: values.specialization }),
      ...(values.doctorId && { doctorId: Number(values.doctorId) }),
    }

    if (isEdit && currentRow?.id) {
      updateMutation.mutate({
        id: currentRow.id,
        data: payload,
      })
    } else {
      createMutation.mutate({
        data: {
          ...payload,
          password: values.password!,
        },
      })
    }
  }

  const watchStaffType = form.watch('staffType')
  const isTrainer = watchStaffType === 'TRAINER'

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Cập nhật thông tin nhân viên. '
              : 'Tạo tài khoản nhân viên mới. '}
            Nhấn lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='staff-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='example@domain.com'
                        className='col-span-4'
                        disabled={isEdit}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='fullName'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Họ và tên
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nguyễn Văn A'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='staffType'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Vai trò
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Chọn vai trò'
                      className='col-span-4'
                      disabled={isEdit}
                      items={staffRoles.map(({ label, value }) => ({
                        label,
                        value,
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='specialization'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Chuyên môn
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Vật lý trị liệu'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              {isTrainer && !isEdit && (
                <FormField
                  control={form.control}
                  name='doctorId'
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 text-end'>
                        ID Bác sĩ
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='1'
                          className='col-span-4'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />
              )}
              {!isEdit && (
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 text-end'>
                        Mật khẩu
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder='Ít nhất 8 ký tự'
                          className='col-span-4'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />
              )}
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            type='submit'
            form='staff-form'
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending
              ? 'Đang lưu...'
              : 'Lưu thay đổi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
