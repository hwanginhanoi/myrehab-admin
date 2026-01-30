'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PasswordInput } from '@/components/password-input'
import { toast } from 'sonner'
import { useCreateStaff, useUpdateStaff, type StaffResponse } from '@/api'

const staffTypeOptions = [
  { value: 'DOCTOR', label: 'Bác sĩ' },
  { value: 'TRAINER', label: 'Huấn luyện viên' },
  { value: 'ADMIN', label: 'Quản trị viên' },
  { value: 'SUPER_ADMIN', label: 'Quản trị viên cao cấp' },
] as const

const formSchema = z
  .object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().optional(),
    fullName: z.string().min(1, 'Họ tên là bắt buộc'),
    phoneNumber: z.string().optional().or(z.literal('')),
    description: z.string().max(500, 'Mô tả không vượt quá 500 ký tự').optional().or(z.literal('')),
    staffType: z.enum(['DOCTOR', 'TRAINER', 'ADMIN', 'SUPER_ADMIN']),
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

type StaffForm = z.infer<typeof formSchema>

type StaffType = 'DOCTOR' | 'TRAINER' | 'ADMIN' | 'SUPER_ADMIN'

type StaffActionDialogProps = {
  currentRow?: StaffResponse
  staffType?: StaffType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StaffActionDialog({
  currentRow,
  staffType = 'DOCTOR',
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
          phoneNumber: currentRow.phoneNumber || '',
          description: currentRow.description || '',
          staffType: (currentRow.staffType as StaffType) || 'DOCTOR',
          password: '',
          isEdit,
        }
      : {
          email: '',
          fullName: '',
          phoneNumber: '',
          description: '',
          staffType: staffType,
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
      ...(values.phoneNumber && { phoneNumber: values.phoneNumber }),
      ...(values.description && { description: values.description }),
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
        <Form {...form}>
          <form
            id='staff-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
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
              name='staffType'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>
                    Loại nhân viên
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isEdit}
                  >
                    <FormControl>
                      <SelectTrigger className='col-span-4'>
                        <SelectValue placeholder='Chọn loại nhân viên' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {staffTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              name='phoneNumber'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>
                    Số điện thoại
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='0912345678'
                      className='col-span-4'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end pt-2'>
                    Mô tả chung
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Mô tả về nhân viên...'
                      className='col-span-4 resize-none'
                      rows={3}
                      maxLength={500}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />
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
