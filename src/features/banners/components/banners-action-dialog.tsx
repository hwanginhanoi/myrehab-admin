import { useCallback, useRef, type FormEvent } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { ImageIcon, Pencil, Plus, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent } from '@/components/ui/dialog'
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
import { bannerStatusOptions } from '@/lib/constants/banner-status'
import { type BannerResponse, useUpdateBanner } from '@/api'
import { toast } from 'sonner'
import { useBanners } from './banners-provider'

const formSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc').max(100, 'Tiêu đề không vượt quá 100 ký tự'),
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

const modeConfig = {
  add: {
    icon: Plus,
    label: 'Mới',
    badgeVariant: 'default' as const,
    title: 'Thêm banner mới',
    description: 'Banner sẽ được thêm vào cuối danh sách.',
    submit: 'Thêm banner',
  },
  edit: {
    icon: Pencil,
    label: 'Chỉnh sửa',
    badgeVariant: 'secondary' as const,
    title: 'Chỉnh sửa banner',
    description: 'Cập nhật thông tin và ảnh banner.',
    submit: 'Lưu thay đổi',
  },
  view: {
    icon: Eye,
    label: 'Xem',
    badgeVariant: 'outline' as const,
    title: 'Chi tiết banner',
    description: 'Thông tin banner hiện tại.',
    submit: '',
  },
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
  const cfg = modeConfig[mode]

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

  const isPending = updateMutation.isPending

  const handleFormSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      void form.handleSubmit(async (values: BannerForm) => {
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
            form.setError('imageUrl', { message: 'Vui lòng chọn ảnh banner' })
            return
          }

          if (isAdd) {
            setDraftBanner({
              title: values.title,
              imageUrl,
              status: values.status,
            })
            toast.info(
              'Banner đã được thêm vào danh sách. Kéo thả để sắp xếp vị trí, sau đó nhấn "Lưu thứ tự" để lưu.'
            )
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
      })(e)
    },
    [
      form,
      isView,
      isAdd,
      isEdit,
      currentRow,
      updateMutation,
      onOpenChange,
      invalidateBanners,
      setDraftBanner,
    ]
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl">
        <Form {...form}>
          <form
            id="banner-form"
            onSubmit={handleFormSubmit}
            className="flex flex-col"
          >
            {/* ── Header ── */}
            <div className="flex items-center gap-3 px-6 py-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-muted">
                <cfg.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold">{cfg.title}</h2>
                  <Badge variant={cfg.badgeVariant} className="text-xs">
                    {cfg.label}
                  </Badge>
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  {cfg.description}
                </p>
              </div>
            </div>

            <Separator />

            {/* ── Image section ── */}
            <div className="bg-muted/30 px-6 py-4">
              <div className="mb-3 flex items-center gap-2">
                <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Ảnh banner
                </span>
                <span className="ms-auto text-xs text-muted-foreground">
                  Tỉ lệ 16:9 · JPEG, PNG, WebP · Tối đa 10MB
                </span>
              </div>
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload
                        ref={imageUploadRef}
                        category="banner-image"
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

            <Separator />

            {/* ── Form fields ── */}
            <div className="flex flex-col gap-4 px-6 py-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Nhập tiêu đề banner..."
                        disabled={isView}
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
                        items={bannerStatusOptions}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ── Footer ── */}
            <Separator />
            <div className="flex items-center justify-end gap-2 px-6 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {isView ? 'Đóng' : 'Hủy'}
              </Button>
              {!isView && (
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Đang lưu...' : cfg.submit}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
