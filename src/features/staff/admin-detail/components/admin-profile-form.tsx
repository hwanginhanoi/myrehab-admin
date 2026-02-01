import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useUpdateStaff, type StaffResponse } from '@/api'

const adminProfileFormSchema = z.object({
  fullName: z
    .string('Vui lòng nhập họ tên.')
    .min(2, 'Họ tên phải có ít nhất 2 ký tự.')
    .max(100, 'Họ tên không được vượt quá 100 ký tự.'),
  email: z.string().email('Vui lòng nhập địa chỉ email hợp lệ.'),
  phoneNumber: z
    .string()
    .max(20, 'Số điện thoại không được vượt quá 20 ký tự.')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .max(500, 'Mô tả không được vượt quá 500 ký tự.')
    .optional()
    .or(z.literal('')),
})

type AdminProfileFormValues = z.infer<typeof adminProfileFormSchema>

type AdminProfileFormProps = {
  admin: StaffResponse
  isLoading: boolean
  readOnly?: boolean
}

export function AdminProfileForm({ admin, isLoading, readOnly }: AdminProfileFormProps) {
  const queryClient = useQueryClient()

  const form = useForm<AdminProfileFormValues>({
    resolver: zodResolver(adminProfileFormSchema),
    defaultValues: {
      fullName: admin.fullName || '',
      email: admin.email || '',
      phoneNumber: admin.phoneNumber || '',
      description: admin.description || '',
    },
    mode: 'onChange',
  })

  const updateMutation = useUpdateStaff({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [{ url: '/api/admin/staff' }] })
        queryClient.invalidateQueries({ queryKey: [{ url: `/api/admin/staff/${admin.id}` }] })
        toast.success('Đã cập nhật thông tin quản trị viên')
      },
      onError: (error) => {
        toast.error(error.message || 'Không thể cập nhật thông tin quản trị viên')
      },
    },
  })

  const onSubmit = (values: AdminProfileFormValues) => {
    if (!admin.id) return

    updateMutation.mutate({
      id: admin.id,
      data: {
        staffType: (admin.staffType as 'ADMIN' | 'SUPER_ADMIN') || 'ADMIN',
        email: values.email,
        fullName: values.fullName,
        ...(values.phoneNumber && { phoneNumber: values.phoneNumber }),
        ...(values.description && { description: values.description }),
      },
    })
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <p className='text-sm text-muted-foreground'>Đang tải...</p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'
      >
        <FormField
          control={form.control}
          name='fullName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên</FormLabel>
              <FormControl>
                <Input placeholder='Nguyễn Văn A' disabled={readOnly} {...field} />
              </FormControl>
              <FormDescription>
                Tên đầy đủ của quản trị viên sẽ hiển thị trên hệ thống.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' placeholder='admin@example.com' disabled {...field} />
              </FormControl>
              <FormDescription>
                Địa chỉ email để liên hệ và đăng nhập hệ thống.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='phoneNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input placeholder='0912345678' disabled={readOnly} {...field} />
              </FormControl>
              <FormDescription>
                Số điện thoại liên hệ của quản trị viên.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Mô tả ngắn về quản trị viên...'
                  className='resize-none'
                  rows={4}
                  disabled={readOnly}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Thông tin mô tả về quản trị viên (tối đa 500 ký tự).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='space-y-4 pt-4 border-t'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium'>Trạng thái tài khoản</p>
              <p className='text-sm text-muted-foreground'>
                Tài khoản hiện đang {admin.enabled ? 'hoạt động' : 'vô hiệu hóa'}
              </p>
            </div>
            <Badge variant={admin.enabled ? 'default' : 'secondary'}>
              {admin.enabled ? 'Hoạt động' : 'Vô hiệu hóa'}
            </Badge>
          </div>

          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium'>Loại tài khoản</p>
              <p className='text-sm text-muted-foreground'>
                {admin.staffType === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
              </p>
            </div>
            <Badge variant={admin.staffType === 'SUPER_ADMIN' ? 'destructive' : 'default'}>
              {admin.staffType === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
            </Badge>
          </div>

          {admin.createdAt && (
            <div>
              <p className='text-sm font-medium'>Ngày tạo</p>
              <p className='text-sm text-muted-foreground'>
                {new Date(admin.createdAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          )}
        </div>

        {!readOnly && (
          <Button type='submit' disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Đang lưu...' : 'Cập nhật thông tin'}
          </Button>
        )}
      </form>
    </Form>
  )
}
