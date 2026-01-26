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

const trainerProfileFormSchema = z.object({
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

type TrainerProfileFormValues = z.infer<typeof trainerProfileFormSchema>

type TrainerProfileFormProps = {
  trainer: StaffResponse
  isLoading: boolean
}

export function TrainerProfileForm({ trainer, isLoading }: TrainerProfileFormProps) {
  const queryClient = useQueryClient()

  const form = useForm<TrainerProfileFormValues>({
    resolver: zodResolver(trainerProfileFormSchema),
    defaultValues: {
      fullName: trainer.fullName || '',
      email: trainer.email || '',
      phoneNumber: trainer.phoneNumber || '',
      description: trainer.description || '',
    },
    mode: 'onChange',
  })

  const updateMutation = useUpdateStaff({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [{ url: '/api/admin/staff' }] })
        queryClient.invalidateQueries({ queryKey: [{ url: `/api/admin/staff/${trainer.id}` }] })
        toast.success('Đã cập nhật thông tin huấn luyện viên')
      },
      onError: (error) => {
        toast.error(error.message || 'Không thể cập nhật thông tin huấn luyện viên')
      },
    },
  })

  const onSubmit = (values: TrainerProfileFormValues) => {
    if (!trainer.id) return

    updateMutation.mutate({
      id: trainer.id,
      data: {
        staffType: 'TRAINER',
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
                <Input placeholder='Nguyễn Văn A' {...field} />
              </FormControl>
              <FormDescription>
                Tên đầy đủ của huấn luyện viên sẽ hiển thị trên hệ thống.
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
                <Input type='email' placeholder='trainer@example.com' disabled {...field} />
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
                <Input placeholder='0912345678' {...field} />
              </FormControl>
              <FormDescription>
                Số điện thoại liên hệ của huấn luyện viên.
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
                  placeholder='Mô tả ngắn về huấn luyện viên...'
                  className='resize-none'
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Thông tin mô tả về huấn luyện viên (tối đa 500 ký tự).
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
                Tài khoản hiện đang {trainer.enabled ? 'hoạt động' : 'vô hiệu hóa'}
              </p>
            </div>
            <Badge variant={trainer.enabled ? 'default' : 'secondary'}>
              {trainer.enabled ? 'Hoạt động' : 'Vô hiệu hóa'}
            </Badge>
          </div>

          {trainer.createdAt && (
            <div>
              <p className='text-sm font-medium'>Ngày tạo</p>
              <p className='text-sm text-muted-foreground'>
                {new Date(trainer.createdAt).toLocaleDateString('vi-VN', {
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

        <Button type='submit' disabled={updateMutation.isPending}>
          {updateMutation.isPending ? 'Đang lưu...' : 'Cập nhật thông tin'}
        </Button>
      </form>
    </Form>
  )
}
