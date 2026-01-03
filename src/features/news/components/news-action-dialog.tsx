'use client'

import { useRef } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import { SelectDropdown } from '@/components/select-dropdown'
import { FileUpload, type FileUploadRef } from '@/components/file-upload'
import { newsStatusOptions } from '@/lib/constants/news-status'
import { newsCategoryTypeOptions } from '@/lib/constants/news-catergories'
import { type NewsResponse, useCreateNews, useUpdateNews } from '@/api'
import { toast } from 'sonner'

const formSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc'),
  content: z.string().min(1, 'Nội dung là bắt buộc'),
  summary: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  status: z.string().min(1, 'Trạng thái là bắt buộc'),
  category: z.string().optional(),
  isEdit: z.boolean(),
})

type NewsForm = z.infer<typeof formSchema>

type NewsActionDialogProps = {
  currentRow?: NewsResponse
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'add' | 'edit' | 'view'
}

export function NewsActionDialog({
   currentRow,
   open,
   onOpenChange,
   mode,
 }: NewsActionDialogProps) {
  const isEdit = mode === 'edit'
  const isView = mode === 'view'

  const queryClient = useQueryClient()
  const imageUploadRef = useRef<FileUploadRef>(null)

  const form = useForm<NewsForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit || isView
        ? {
          title: currentRow?.title || '',
          content: currentRow?.content || '',
          summary: currentRow?.summary || '',
          thumbnailUrl: currentRow?.thumbnailUrl || '',
          status: currentRow?.status || '',
          category: currentRow?.category || '',
          isEdit,
        }
        : {
          title: '',
          content: '',
          summary: '',
          thumbnailUrl: '',
          status: 'DRAFT',
          category: '',
          isEdit: false,
        },
  })

  const createMutation = useCreateNews({
    mutation: {
      onSuccess: () => {
        toast.success('Tạo tin tức thành công')
        form.reset()
        onOpenChange(false)
        queryClient.invalidateQueries({ queryKey: [{ url: '/api/news' }] })
      },
      onError: (error) => {
        toast.error('Tạo tin tức thất bại: ' + error.message)
      },
    },
  })

  const updateMutation = useUpdateNews({
    mutation: {
      onSuccess: () => {
        toast.success('Cập nhật tin tức thành công')
        form.reset()
        onOpenChange(false)
        queryClient.invalidateQueries({ queryKey: [{ url: '/api/news' }] })
      },
      onError: (error) => {
        toast.error('Cập nhật tin tức thất bại: ' + error.message)
      },
    },
  })

  const onSubmit = async (values: NewsForm) => {
    if (isView) {
      onOpenChange(false)
      return
    }

    try {
      // Upload image if new file selected
      let thumbnailUrl = values.thumbnailUrl

      if (imageUploadRef.current?.hasFile()) {
        const uploadedImageKey = await imageUploadRef.current.upload()
        if (uploadedImageKey) {
          thumbnailUrl = uploadedImageKey
        } else {
          toast.error('Không thể tải lên ảnh')
          return
        }
      }

      const payload = {
        title: values.title,
        content: values.content,
        summary: values.summary || undefined,
        thumbnailUrl: thumbnailUrl || undefined,
        status: values.status as NonNullable<NewsResponse['status']>,
        category: values.category || undefined,
      }

      if (isEdit && currentRow?.id) {
        updateMutation.mutate({
          id: currentRow.id,
          data: payload,
        })
      } else {
        createMutation.mutate({
          data: payload,
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Có lỗi xảy ra khi lưu tin tức')
    }
  }

  const getTitle = () => {
    if (isView) return 'Xem tin tức'
    if (isEdit) return 'Chỉnh sửa tin tức'
    return 'Thêm tin tức mới'
  }

  const getDescription = () => {
    if (isView) return 'Thông tin chi tiết tin tức.'
    if (isEdit) return 'Cập nhật thông tin tin tức. Nhấn lưu khi hoàn thành.'
    return 'Tạo tin tức mới. Nhấn lưu khi hoàn thành.'
  }

  return (
      <Dialog
          open={open}
          onOpenChange={(state) => {
            form.reset()
            onOpenChange(state)
          }}
      >
        <DialogContent className='sm:max-w-6xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader className='text-start'>
            <DialogTitle>{getTitle()}</DialogTitle>
            <DialogDescription>{getDescription()}</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
                id='news-form'
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
            >
              <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-end'>
                          Tiêu đề
                        </FormLabel>
                        <FormControl>
                          <Input
                              placeholder='Nhập tiêu đề'
                              className='col-span-4'
                              disabled={isView}
                              {...field}
                          />
                        </FormControl>
                        <FormMessage className='col-span-4 col-start-3' />
                      </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name='summary'
                  render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-end pt-2'>
                          Tóm tắt
                        </FormLabel>
                        <FormControl>
                          <Textarea
                              placeholder='Nhập tóm tắt'
                              className='col-span-4 min-h-[80px]'
                              disabled={isView}
                              {...field}
                          />
                        </FormControl>
                        <FormMessage className='col-span-4 col-start-3' />
                      </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name='content'
                  render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-end pt-2'>
                          Nội dung
                        </FormLabel>
                        <FormControl>
                          <Textarea
                              placeholder='Nhập nội dung tin tức'
                              className='col-span-4 min-h-[150px]'
                              disabled={isView}
                              {...field}
                          />
                        </FormControl>
                        <FormMessage className='col-span-4 col-start-3' />
                      </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name='thumbnailUrl'
                  render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-end pt-2'>
                          Ảnh đại diện
                        </FormLabel>
                        <FormControl>
                          <FileUpload
                              ref={imageUploadRef}
                              category='news-image'
                              value={field.value}
                              onChange={field.onChange}
                              disabled={isView}
                              className='col-span-4'
                              label={undefined}
                          />
                        </FormControl>
                        <FormMessage className='col-span-4 col-start-3' />
                      </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name='category'
                  render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-end'>Danh mục</FormLabel>
                        <FormControl>
                          <SelectDropdown
                              defaultValue={field.value}
                              onValueChange={field.onChange}
                              placeholder='Chọn danh mục'
                              className='col-span-4'
                              disabled={isView}
                              items={newsCategoryTypeOptions}
                          />
                        </FormControl>
                        <FormMessage className='col-span-4 col-start-3' />
                      </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-end'>Trạng thái</FormLabel>
                        <FormControl>
                          <SelectDropdown
                              defaultValue={field.value}
                              onValueChange={field.onChange}
                              placeholder='Chọn trạng thái'
                              className='col-span-4'
                              disabled={isView}
                              items={newsStatusOptions}
                          />
                        </FormControl>
                        <FormMessage className='col-span-4 col-start-3' />
                      </FormItem>
                  )}
              />
            </form>
          </Form>
          <DialogFooter>
            {!isView && (
                <Button
                    type='submit'
                    form='news-form'
                    disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Đang lưu...' : 'Lưu'}
                </Button>
            )}
            {isView && (
                <Button onClick={() => onOpenChange(false)}>
                  Đóng
                </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
  )
}
