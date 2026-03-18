import { useCallback, useRef } from 'react'
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
  FormDescription,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { FileUpload, type FileUploadRef } from '@/components/file-upload'
import {
  type StartupPopupResponse,
  useCreatePopup,
  useUpdatePopup,
} from '@/api'
import { toast } from 'sonner'

const formSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc').max(100, 'Tiêu đề không vượt quá 100 ký tự'),
  imageUrl: z.string().optional(),
  active: z.boolean(),
})

type PopupForm = z.infer<typeof formSchema>

type StartupPopupsActionDialogProps = {
  currentRow?: StartupPopupResponse
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'add' | 'edit' | 'view'
}

const modeConfig = {
  add: {
    icon: Plus,
    label: 'Mới',
    badgeVariant: 'default' as const,
    title: 'Thêm popup mới',
    description: 'Tạo popup hiển thị khi khởi động ứng dụng.',
    submit: 'Tạo popup',
  },
  edit: {
    icon: Pencil,
    label: 'Chỉnh sửa',
    badgeVariant: 'secondary' as const,
    title: 'Chỉnh sửa popup',
    description: 'Cập nhật thông tin và ảnh popup.',
    submit: 'Lưu thay đổi',
  },
  view: {
    icon: Eye,
    label: 'Xem',
    badgeVariant: 'outline' as const,
    title: 'Chi tiết popup',
    description: 'Thông tin popup hiện tại.',
    submit: '',
  },
}

export function StartupPopupsActionDialog({
  currentRow,
  open,
  onOpenChange,
  mode,
}: StartupPopupsActionDialogProps) {
  const isAdd = mode === 'add'
  const isEdit = mode === 'edit'
  const isView = mode === 'view'
  const cfg = modeConfig[mode]

  const queryClient = useQueryClient()
  const imageUploadRef = useRef<FileUploadRef>(null)

  const form = useForm<PopupForm>({
    resolver: zodResolver(formSchema),
    defaultValues:
      isEdit || isView
        ? {
            title: currentRow?.title || '',
            imageUrl: currentRow?.imageUrl || '',
            active: currentRow?.active ?? false,
          }
        : {
            title: '',
            imageUrl: '',
            active: false,
          },
  })

  const createMutation = useCreatePopup()
  const updateMutation = useUpdatePopup()

  const invalidatePopups = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [{ url: '/api/startup-popup' }] })
  }, [queryClient])

  const onSubmit = useCallback(
    async (values: PopupForm) => {
      try {
        const imageUrl = values.imageUrl || ''

        if (!imageUrl) {
          toast.error('Vui lòng chọn ảnh popup')
          return
        }

        if (isAdd) {
          createMutation.mutate(
            { data: { title: values.title, imageUrl, active: values.active } },
            {
              onSuccess: () => {
                toast.success('Tạo popup thành công')
                form.reset()
                onOpenChange(false)
                invalidatePopups()
              },
              onError: (error) => {
                toast.error('Tạo popup thất bại: ' + error.message)
              },
            }
          )
          return
        }

        if (isEdit && currentRow?.id) {
          updateMutation.mutate(
            {
              id: currentRow.id,
              data: { title: values.title, imageUrl, active: values.active },
            },
            {
              onSuccess: () => {
                toast.success('Cập nhật popup thành công')
                form.reset()
                onOpenChange(false)
                invalidatePopups()
              },
              onError: (error) => {
                toast.error('Cập nhật popup thất bại: ' + error.message)
              },
            }
          )
        }
      } catch {
        toast.error('Có lỗi xảy ra khi lưu popup')
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAdd, isEdit, currentRow?.id, invalidatePopups]
  )

  const handleSubmitClick = async () => {
    if (isView) {
      onOpenChange(false)
      return
    }
    if (imageUploadRef.current?.hasFile()) {
      const uploaded = await imageUploadRef.current.upload()
      if (!uploaded) {
        toast.error('Không thể tải lên ảnh popup')
        return
      }
      form.setValue('imageUrl', uploaded)
    }
    form.handleSubmit(onSubmit)()
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <Form {...form}>
          <div className="flex">
            {/* ── Left — portrait image panel ── */}
            <div className="flex w-48 shrink-0 flex-col border-e bg-muted/40">
              <div className="flex items-center gap-2 px-4 pt-4 pb-3">
                <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Ảnh popup
                </span>
              </div>

              {/* Portrait image area — fill remaining height */}
              <div className="flex flex-1 flex-col px-4 pb-4">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem className="flex flex-1 flex-col">
                      <FormControl>
                        {/*
                         * The FileUpload component renders a 16:9 aspect container internally.
                         * We override it to 9:16 so the portrait preview fills correctly.
                         */}
                        <div className="flex flex-1 flex-col [&_.aspect-video]:aspect-[9/16]">
                          <FileUpload
                            ref={imageUploadRef}
                            category="startup-popup-image"
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isView}
                            label={undefined}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border-t px-4 py-3">
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Tỉ lệ 9:16 · JPEG, PNG, WebP · Tối đa 10MB
                </p>
              </div>
            </div>

            {/* ── Right — form panel ── */}
            <div className="flex flex-1 flex-col">
              {/* Header */}
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

              {/* Form body */}
              <div className="flex flex-1 flex-col gap-5 px-6 py-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề</FormLabel>
                      <FormControl>
                        <Input
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Nhập tiêu đề popup..."
                          disabled={isView}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex items-start justify-between gap-4 rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm font-medium">
                          Hiển thị popup
                        </FormLabel>
                        <FormDescription className="text-xs">
                          Bật sẽ tắt tất cả popup đang hiển thị khác.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isView}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Footer */}
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
                  <Button
                    type="button"
                    disabled={isPending}
                    onClick={handleSubmitClick}
                  >
                    {isPending ? 'Đang lưu...' : cfg.submit}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
