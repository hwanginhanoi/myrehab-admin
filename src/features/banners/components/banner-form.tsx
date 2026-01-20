'use client'

import { useRef } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { FileUpload, type FileUploadRef } from '@/components/file-upload'
import {
  type BannerResponse,
  useCreateBanner,
  useUpdateBanner,
} from '@/api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc'),
  description: z.string().optional(),
  linkUrl: z.string().optional(),
  displayOrder: z.coerce.number().min(0, 'Thứ tự phải lớn hơn hoặc bằng 0'),
  imageUrl: z.string(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
})

type BannerForm = z.infer<typeof formSchema>

type BannerFormComponentProps = {
  banner?: BannerResponse
  mode: 'create' | 'edit' | 'view'
}

export function BannerFormComponent({ banner, mode }: BannerFormComponentProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isView = mode === 'view'
  const isEdit = mode === 'edit'

  // Refs for file uploads
  const imageUploadRef = useRef<FileUploadRef>(null)

  const form = useForm<BannerForm>({
    resolver: zodResolver(formSchema),
    defaultValues: banner
      ? {
          title: banner.title || '',
          description: banner.description || '',
          linkUrl: banner.linkUrl || '',
          displayOrder: banner.displayOrder || 0,
          imageUrl: banner.imageUrl || '',
          startDate: banner.startDate ? new Date(banner.startDate) : null,
          endDate: banner.endDate ? new Date(banner.endDate) : null,
        }
      : {
          title: '',
          description: '',
          linkUrl: '',
          displayOrder: 0,
          imageUrl: '',
          startDate: null,
          endDate: null,
        },
  })

  const createMutation = useCreateBanner({
    mutation: {
      onSuccess: () => {
        toast.success('Tạo banner thành công')
        void queryClient.invalidateQueries({ queryKey: [{ url: '/api/banners' }] })
        void navigate({ to: '/banners' })
      },
      onError: (error) => {
        toast.error('Tạo banner thất bại: ' + error.message)
      },
    },
  })

  const updateMutation = useUpdateBanner({
    mutation: {
      onSuccess: () => {
        toast.success('Cập nhật banner thành công')
        void queryClient.invalidateQueries({ queryKey: [{ url: '/api/banners' }] })
        void navigate({ to: '/banners' })
      },
      onError: (error) => {
        toast.error('Cập nhật banner thất bại: ' + error.message)
      },
    },
  })

  const onSubmit = async (values: BannerForm) => {
    try {
      // Check if image is provided (either uploaded or new file)
      const hasImage = values.imageUrl || imageUploadRef.current?.hasFile()
      if (!hasImage) {
        toast.error('Vui lòng chọn hình ảnh banner')
        return
      }

      // Upload files if they exist
      let imageUrl = values.imageUrl

      // Upload image if new file selected
      if (imageUploadRef.current?.hasFile()) {
        const uploadedImageKey = await imageUploadRef.current.upload()
        if (uploadedImageKey) {
          imageUrl = uploadedImageKey
        } else {
          toast.error('Không thể tải lên hình ảnh')
          return
        }
      }

      // Format dates to YYYY-MM-DD string format for API
      const formatDateForApi = (date: Date | null | undefined): string | undefined => {
        if (!date) return undefined
        return format(date, 'yyyy-MM-dd')
      }

      const payload = {
        title: values.title,
        description: values.description || undefined,
        linkUrl: values.linkUrl || undefined,
        displayOrder: values.displayOrder,
        imageUrl,
        isActive: banner?.isActive ?? true,
        startDate: formatDateForApi(values.startDate),
        endDate: formatDateForApi(values.endDate),
      }

      if (isEdit && banner?.id) {
        updateMutation.mutate({
          id: banner.id,
          data: payload,
        })
      } else {
        createMutation.mutate({
          data: payload,
        })
      }
    } catch {
      toast.error('Có lỗi xảy ra khi tải lên file')
    }
  }

  const getTitle = () => {
    if (isView) return 'Xem chi tiết banner'
    if (isEdit) return 'Chỉnh sửa banner'
    return 'Thêm banner mới'
  }

  const getDescription = () => {
    if (isView) return 'Thông tin chi tiết của banner.'
    if (isEdit) return 'Cập nhật thông tin banner.'
    return 'Tạo banner mới để hiển thị trên ứng dụng.'
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>{getTitle()}</h2>
        <p className='text-muted-foreground'>{getDescription()}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          {/* Section: Thông tin cơ bản */}
          <div className='rounded-lg border p-6 space-y-6'>
            <h3 className='text-lg font-semibold'>Thông tin cơ bản</h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập tiêu đề banner'
                        disabled={isView}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='displayOrder'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thứ tự hiển thị</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={0}
                        placeholder='Nhập thứ tự hiển thị'
                        disabled={isView}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Nhập mô tả banner'
                      className='min-h-[100px]'
                      disabled={isView}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='linkUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='https://example.com'
                      disabled={isView}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='imageUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hình ảnh</FormLabel>
                  <FormControl>
                    <FileUpload
                      ref={imageUploadRef}
                      category='banner-image'
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isView}
                      label={undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Schedule section */}
            <div className='space-y-4'>
              <h4 className='text-md font-medium'>Lịch hiển thị</h4>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <FormField
                  control={form.control}
                  name='startDate'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>Ngày bắt đầu</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant='outline'
                              disabled={isView}
                              className={cn(
                                'w-full justify-start text-start font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'dd/MM/yyyy')
                              ) : (
                                <span>Chọn ngày bắt đầu</span>
                              )}
                              <CalendarIcon className='ms-auto h-4 w-4 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='single'
                            captionLayout='dropdown'
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='endDate'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>Ngày kết thúc</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant='outline'
                              disabled={isView}
                              className={cn(
                                'w-full justify-start text-start font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'dd/MM/yyyy')
                              ) : (
                                <span>Chọn ngày kết thúc</span>
                              )}
                              <CalendarIcon className='ms-auto h-4 w-4 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='single'
                            captionLayout='dropdown'
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormDescription>
                Để trống nếu muốn banner hiển thị vô thời hạn
              </FormDescription>
            </div>
          </div>

          <div className='flex gap-3 justify-end pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => void navigate({ to: '/banners' })}
            >
              {isView ? 'Đóng' : 'Hủy'}
            </Button>
            {!isView && (
              <Button
                type='submit'
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? 'Đang lưu...'
                  : 'Lưu'}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
