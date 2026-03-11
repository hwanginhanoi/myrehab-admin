import { useCallback, useRef, type FormEvent } from 'react'
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
import { Switch } from '@/components/ui/switch'
import { FileUpload, type FileUploadRef } from '@/components/file-upload'
import {
  type StartupPopupResponse,
  useCreatePopup,
  useUpdatePopup,
} from '@/api'
import { toast } from 'sonner'

const formSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc').max(255),
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

export function StartupPopupsActionDialog({
  currentRow,
  open,
  onOpenChange,
  mode,
}: StartupPopupsActionDialogProps) {
  const isAdd = mode === 'add'
  const isEdit = mode === 'edit'
  const isView = mode === 'view'

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
    queryClient.invalidateQueries({
      queryKey: [{ url: '/api/startup-popup' }],
    })
  }, [queryClient])

  const getTitle = () => {
    if (isView) return 'Xem popup'
    if (isEdit) return 'Chỉnh sửa popup'
    return 'Thêm popup mới'
  }

  const getDescription = () => {
    if (isView) return 'Thông tin chi tiết popup.'
    if (isEdit) return 'Cập nhật thông tin popup. Nhấn lưu khi hoàn thành.'
    return 'Tạo popup mới. Nếu bật hiển thị, các popup khác sẽ tự động bị tắt.'
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  const handleFormSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      void form.handleSubmit(async (values: PopupForm) => {
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
              toast.error('Không thể tải lên ảnh popup')
              return
            }
          }

          if (!imageUrl) {
            toast.error('Vui lòng chọn ảnh popup')
            return
          }

          if (isAdd) {
            createMutation.mutate(
              {
                data: {
                  title: values.title,
                  imageUrl,
                  active: values.active,
                },
              },
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
                data: {
                  title: values.title,
                  imageUrl,
                  active: values.active,
                },
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
      })(e)
    },
    [form, isView, isAdd, isEdit, currentRow, createMutation, updateMutation, onOpenChange, invalidatePopups]
  )

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
            id="popup-form"
            onSubmit={handleFormSubmit}
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
                    Ảnh popup
                  </FormLabel>
                  <FormControl>
                    <div className="col-span-4 [&_.aspect-video]:aspect-[9/16]">
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
                  <FormMessage className="col-span-4 col-start-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                  <FormLabel className="col-span-2 text-end">
                    Hiển thị
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isView}
                    />
                  </FormControl>
                  <FormMessage className="col-span-4 col-start-3" />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          {!isView && (
            <Button type="submit" form="popup-form" disabled={isPending}>
              {isPending ? 'Đang lưu...' : isAdd ? 'Thêm' : 'Lưu'}
            </Button>
          )}
          {isView && <Button onClick={() => onOpenChange(false)}>Đóng</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
