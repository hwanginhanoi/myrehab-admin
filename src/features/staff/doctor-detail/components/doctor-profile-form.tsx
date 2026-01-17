import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/lib/show-submitted-data'
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
import type { StaffResponse } from '@/api'

const doctorProfileFormSchema = z.object({
  fullName: z
    .string('Please enter full name.')
    .min(2, 'Full name must be at least 2 characters.')
    .max(100, 'Full name must not be longer than 100 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  specialization: z
    .string()
    .max(200, 'Specialization must not be longer than 200 characters.')
    .optional()
    .or(z.literal('')),
  bio: z
    .string()
    .max(500, 'Bio must not be longer than 500 characters.')
    .optional()
    .or(z.literal('')),
})

type DoctorProfileFormValues = z.infer<typeof doctorProfileFormSchema>

type DoctorProfileFormProps = {
  doctor: StaffResponse
  isLoading: boolean
}

export function DoctorProfileForm({ doctor, isLoading }: DoctorProfileFormProps) {
  const form = useForm<DoctorProfileFormValues>({
    resolver: zodResolver(doctorProfileFormSchema),
    defaultValues: {
      fullName: doctor.fullName || '',
      email: doctor.email || '',
      specialization: doctor.specialization || '',
      bio: '',
    },
    mode: 'onChange',
  })

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
        onSubmit={form.handleSubmit((data) => showSubmittedData(data))}
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
                Tên đầy đủ của bác sĩ sẽ hiển thị trên hệ thống.
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
                <Input type='email' placeholder='doctor@example.com' {...field} />
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
          name='specialization'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chuyên môn</FormLabel>
              <FormControl>
                <Input placeholder='Chuyên khoa phục hồi chức năng' {...field} />
              </FormControl>
              <FormDescription>
                Lĩnh vực chuyên môn hoặc chuyên khoa của bác sĩ.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giới thiệu</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Giới thiệu ngắn về bác sĩ...'
                  className='resize-none'
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Thông tin giới thiệu về bác sĩ (tối đa 500 ký tự).
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
                Tài khoản hiện đang {doctor.enabled ? 'hoạt động' : 'vô hiệu hóa'}
              </p>
            </div>
            <Badge variant={doctor.enabled ? 'default' : 'secondary'}>
              {doctor.enabled ? 'Hoạt động' : 'Vô hiệu hóa'}
            </Badge>
          </div>

          {doctor.createdAt && (
            <div>
              <p className='text-sm font-medium'>Ngày tạo</p>
              <p className='text-sm text-muted-foreground'>
                {new Date(doctor.createdAt).toLocaleDateString('vi-VN', {
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

        <Button type='submit'>Cập nhật thông tin</Button>
      </form>
    </Form>
  )
}
