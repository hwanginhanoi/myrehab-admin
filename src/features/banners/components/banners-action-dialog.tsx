import { useCallback, useRef } from 'react'
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
import { SelectDropdown } from '@/components/select-dropdown'
import { FileUpload, type FileUploadRef } from '@/components/file-upload'
import { bannerStatusOptions } from '@/lib/constants/banner-status'
import { type BannerResponse, useUpdateBanner } from '@/api'
import { toast } from 'sonner'
import { useBanners } from './banners-provider'

const formSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc'),
  imageUrl: z.string().optional(),
  status: z.string().min(1, 'Trạng thái là bắt buộc'),
})

type BannerForm = z.infer<typeof formSchema>

type BannersActionDialogProps = {
  currentRow?: BannerResponse
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'add' | 'edit' | 'view'
}

export function BannersActionDialog({
  currentRow,
  open,
  onOpenChange,
  mode,
}: BannersActionDialogProps) {
  const isAdd = mode === 'add'
  const isEdit = mode === 'edit'
  const isView = mode === 'view'

  const queryClient = useQueryClient()
  const imageUploadRef = useRef<FileUploadRef>(null)
  const { setDraftBanner } = useBanners()

  const form = useForm<BannerForm>({
    resolver: zodResolver(formSchema),
    defaultValues:
      isEdit || isView
        ? {
            title: currentRow?.title || '',
            imageUrl: currentRow?.imageUrl || '',
            status: currentRow?.status || '',
          }
        : {
            title: '',
            imageUrl: '',
            status: 'ACTIVE',
          },
  })

  const updateMutation = useUpdateBanner()

  const invalidateBanners = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [{ url: '/api/banners/all' }],
    })
  }, [queryClient])

  const onSubmit = async (values: BannerForm) => {
    if (isView) {
      onOpenChange(false)
      return
    }

    try {
      let imageUrl = values.imageUrl || ''

      if (imageUploadRef.current?.hasFile()) {
        const uploadedImageKey = await imageUploadRef.current.upload()
        if (uploadedImageKey) {
          imageUrl = uploadedImageKey
        } else {
          toast.error('Không thể tải lên ảnh banner')
          return
        }
      }

      if (!imageUrl) {
        toast.error('Vui lòng chọn ảnh banner')
        return
      }

      if (isAdd) {
        // Don't call API yet — add as draft row in the table
        setDraftBanner({
          title: values.title,
          imageUrl,
          status: values.status,
        })
        toast.info('Banner đã được thêm vào danh sách. Kéo thả để sắp xếp vị trí, sau đó nhấn "Lưu thứ tự" để lưu.')
        form.reset()
        onOpenChange(false)
        return
      }

      if (isEdit && currentRow?.id) {
        updateMutation.mutate(
          {
            id: currentRow.id,
            data: {
              title: values.title,
              imageUrl,
              status: values.status as NonNullable<BannerResponse['status']>,
            },
          },
          {
            onSuccess: () => {
              toast.success('Cập nhật banner thành công')
              form.reset()
              onOpenChange(false)
              invalidateBanners()
            },
            onError: (error) => {
              toast.error('Cập nhật banner thất bại: ' + error.message)
            },
          }
        )
      }
    } catch {
      toast.error('Có lỗi xảy ra khi lưu banner')
    }
  }

  const getTitle = () => {
    if (isView) return 'Xem banner'
    if (isEdit) return 'Chỉnh sửa banner'
    return 'Thêm banner mới'
  }

  const getDescription = () => {
    if (isView) return 'Thông tin chi tiết banner.'
    if (isEdit)
      return 'Cập nhật thông tin banner. Nhấn lưu khi hoàn thành.'
    return 'Tạo banner mới. Banner sẽ được thêm vào cuối danh sách.'
  }

  const isPending = updateMutation.isPending

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="banner-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                  <FormLabel className="col-span-2 text-end">
                    Tiêu đề
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tiêu đề"
                      className="col-span-4"
                      disabled={isView}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-4 col-start-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1">
                  <FormLabel className="col-span-2 pt-2 text-end">
                    Ảnh banner
                  </FormLabel>
                  <FormControl>
                    <FileUpload
                      ref={imageUploadRef}
                      category="banner-image"
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isView}
                      className="col-span-4"
                      label={undefined}
                    />
                  </FormControl>
                  <FormMessage className="col-span-4 col-start-3" />
                </FormItem>
              )}
            />
            {!isAdd && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">
                      Trạng thái
                    </FormLabel>
                    <FormControl>
                      <SelectDropdown
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder="Chọn trạng thái"
                        className="col-span-4"
                        disabled={isView}
                        items={bannerStatusOptions}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
            )}
          </form>
        </Form>

        <DialogFooter>
          {!isView && (
            <Button type="submit" form="banner-form" disabled={isPending}>
              {isPending ? 'Đang lưu...' : isAdd ? 'Thêm' : 'Lưu'}
            </Button>
          )}
          {isView && <Button onClick={() => onOpenChange(false)}>Đóng</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
