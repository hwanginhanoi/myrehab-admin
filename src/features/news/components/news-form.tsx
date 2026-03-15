import { useRef, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { SelectDropdown } from '@/components/select-dropdown'
import { FileUpload, type FileUploadRef } from '@/components/file-upload'
import {
  MultilangInput,
  MultilangTextarea,
} from '@/components/multilang-input'
import { MultilangTiptap } from '@/components/multilang-tiptap'
import { MultilangLangProvider } from '@/context/multilang-lang-context'
import { MultilangFormMessage } from '@/components/multilang-form-message'
import { newsStatusOptions } from '@/lib/constants/news-status'
import { newsCategoryTypeOptions } from '@/lib/constants/news-categories'
import { type NewsResponse, useCreateNews, useUpdateNews } from '@/api'
import { toast } from 'sonner'
import {
  requestPresignedUploadUrl,
  uploadFileToMinIO,
  getPublicImageUrl,
} from '@/lib/file-upload'
import {
  multilangRequired,
  multilangOptional,
  emptyMultilang,
  fromMultilang,
  toMultilang,
} from '@/lib/multilang'

/**
 * Helper function to convert base64 string to File object
 */
const base64ToFile = (base64String: string, filename: string): File => {
  const arr = base64String.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png'
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

/**
 * Process HTML content and upload all base64 images to MinIO
 * Returns updated HTML with public URLs
 */
const processAndUploadImages = async (htmlContent: string): Promise<string> => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlContent, 'text/html')
  const images = doc.querySelectorAll('img')

  let imageIndex = 0
  const uploadPromises: Promise<void>[] = []

  images.forEach((img) => {
    const src = img.getAttribute('src')

    // Check if image is base64
    if (src && src.startsWith('data:image')) {
      const uploadPromise = (async () => {
        // Convert base64 to file
        const file = base64ToFile(
          src,
          `news-image-${Date.now()}-${imageIndex}.png`
        )
        imageIndex++

        // Upload to MinIO
        const { presignedUrl, objectKey } = await requestPresignedUploadUrl({
          fileName: file.name,
          contentType: file.type,
          category: 'news-image',
        })

        await uploadFileToMinIO(presignedUrl, file, file.type)

        // Get public URL
        const publicUrl = getPublicImageUrl(objectKey)

        // Replace base64 with public URL
        img.setAttribute('src', publicUrl)
      })()

      uploadPromises.push(uploadPromise)
    }
  })

  // Wait for all uploads to complete
  await Promise.all(uploadPromises)

  // Return updated HTML
  return doc.body.innerHTML
}

const formSchema = z.object({
  title: multilangRequired('Tiêu đề là bắt buộc'),
  content: multilangRequired('Nội dung là bắt buộc'),
  summary: multilangOptional(),
  thumbnailUrl: z.string().optional(),
  status: z.string().min(1, 'Trạng thái là bắt buộc'),
  category: z.string().optional(),
})

type NewsForm = z.infer<typeof formSchema>

type NewsFormComponentProps = {
  news?: NewsResponse
  mode: 'create' | 'edit' | 'view'
}

export function NewsFormComponent({ news, mode }: NewsFormComponentProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isView = mode === 'view'
  const isEdit = mode === 'edit'

  const imageUploadRef = useRef<FileUploadRef>(null)
  const [uploadingContentImages, setUploadingContentImages] = useState(false)

  const form = useForm<NewsForm>({
    resolver: zodResolver(formSchema),
    defaultValues: news
      ? {
          title: fromMultilang(news.title),
          content: fromMultilang(news.content),
          summary: fromMultilang(news.summary),
          thumbnailUrl: news.thumbnailUrl || '',
          status: news.status || '',
          category: news.category || '',
        }
      : {
          title: emptyMultilang,
          content: emptyMultilang,
          summary: emptyMultilang,
          thumbnailUrl: '',
          status: 'DRAFT',
          category: '',
        },
  })

  const createMutation = useCreateNews({
    mutation: {
      onSuccess: () => {
        toast.success('Tạo tin tức thành công')
        void queryClient.invalidateQueries({
          queryKey: [{ url: '/api/news' }],
        })
        void navigate({ to: '/news' })
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
        void queryClient.invalidateQueries({
          queryKey: [{ url: '/api/news' }],
        })
        void navigate({ to: '/news' })
      },
      onError: (error) => {
        toast.error('Cập nhật tin tức thất bại: ' + error.message)
      },
    },
  })

  const onSubmit = async (values: NewsForm) => {
    try {
      // Upload thumbnail image if new file selected
      let thumbnailUrl = values.thumbnailUrl

      if (imageUploadRef.current?.hasFile()) {
        const uploadedImageKey = await imageUploadRef.current.upload()
        if (uploadedImageKey) {
          thumbnailUrl = uploadedImageKey
        } else {
          toast.error('Không thể tải lên ảnh đại diện')
          return
        }
      }

      // Process content and upload any base64 images to MinIO for both languages
      const processedContent = { ...values.content }
      try {
        setUploadingContentImages(true)
        if (processedContent.vi && processedContent.vi.includes('data:image')) {
          processedContent.vi = await processAndUploadImages(processedContent.vi)
        }
        if (processedContent.en && processedContent.en.includes('data:image')) {
          processedContent.en = await processAndUploadImages(processedContent.en)
        }
      } catch {
        toast.error('Không thể tải lên ảnh trong nội dung')
        return
      } finally {
        setUploadingContentImages(false)
      }

      const payload = {
        title: toMultilang(values.title),
        content: toMultilang(processedContent),
        summary: values.summary?.vi || values.summary?.en ? toMultilang(values.summary) : undefined,
        thumbnailUrl: thumbnailUrl || undefined,
        status: values.status as NonNullable<NewsResponse['status']>,
        category: values.category || undefined,
      }

      if (isEdit && news?.id) {
        updateMutation.mutate({
          id: news.id,
          data: payload,
        })
      } else {
        createMutation.mutate({
          data: payload,
        })
      }
    } catch {
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
    if (isEdit) return 'Cập nhật thông tin tin tức.'
    return 'Tạo tin tức mới.'
  }

  return (
    <MultilangLangProvider>
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{getTitle()}</h2>
        <p className="text-muted-foreground">{getDescription()}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiêu đề</FormLabel>
                <FormControl>
                  <MultilangInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={{ vi: 'Nhập tiêu đề', en: 'Enter title' }}
                    disabled={isView}
                    errors={{
                      vi: form.formState.errors.title?.vi?.message,
                      en: form.formState.errors.title?.en?.message,
                    }}
                  />
                </FormControl>
                <MultilangFormMessage errors={form.formState.errors.title} />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tóm tắt</FormLabel>
                <FormControl>
                  <MultilangTextarea
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={{ vi: 'Nhập tóm tắt', en: 'Enter summary' }}
                    disabled={isView}
                    textareaClassName="min-h-[80px]"
                    errors={{
                      vi: form.formState.errors.summary?.vi?.message,
                      en: form.formState.errors.summary?.en?.message,
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nội dung</FormLabel>
                <FormControl>
                  <MultilangTiptap
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isView}
                    placeholder={{ vi: 'Nhập nội dung tin tức', en: 'Enter news content' }}
                    errors={{
                      vi: form.formState.errors.content?.vi?.message,
                      en: form.formState.errors.content?.en?.message,
                    }}
                  />
                </FormControl>
                <MultilangFormMessage errors={form.formState.errors.content} />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="thumbnailUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ảnh đại diện</FormLabel>
                  <FormControl>
                    <FileUpload
                      ref={imageUploadRef}
                      category="news-image"
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục</FormLabel>
                  <FormControl>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder="Chọn danh mục"
                      disabled={isView}
                      items={newsCategoryTypeOptions}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <FormControl>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder="Chọn trạng thái"
                      disabled={isView}
                      items={newsStatusOptions}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => void navigate({ to: '/news' })}
            >
              {isView ? 'Đóng' : 'Hủy'}
            </Button>
            {!isView && (
              <Button
                type="submit"
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  uploadingContentImages
                }
              >
                {uploadingContentImages
                  ? 'Đang tải ảnh lên...'
                  : createMutation.isPending || updateMutation.isPending
                    ? 'Đang lưu...'
                    : 'Lưu'}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
    </MultilangLangProvider>
  )
}
