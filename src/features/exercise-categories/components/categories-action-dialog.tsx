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
import { SelectDropdown } from '@/components/select-dropdown'
import {
  MultilangInput,
  MultilangTextarea,
} from '@/components/multilang-input'
import { categoryTypeOptions } from '@/lib/constants/category-type'
import {
  type CategoryResponse,
  useCreateCategory,
  useUpdateCategory,
} from '@/api'
import { toast } from 'sonner'
import {
  multilangRequired,
  multilangOptional,
  emptyMultilang,
  fromMultilang,
  toMultilang,
} from '@/lib/multilang'

const formSchema = z.object({
  name: multilangRequired('Tên danh mục là bắt buộc'),
  type: z.string().min(1, 'Phân loại là bắt buộc'),
  description: multilangOptional(),
  isEdit: z.boolean(),
})

type CategoryForm = z.infer<typeof formSchema>

type CategoriesActionDialogProps = {
  currentRow?: CategoryResponse
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'add' | 'edit' | 'view'
}

export function CategoriesActionDialog({
  currentRow,
  open,
  onOpenChange,
  mode,
}: CategoriesActionDialogProps) {
  const isEdit = mode === 'edit'
  const isView = mode === 'view'

  const queryClient = useQueryClient()

  const form = useForm<CategoryForm>({
    resolver: zodResolver(formSchema),
    defaultValues:
      isEdit || isView
        ? {
            name: fromMultilang(currentRow?.name),
            type: currentRow?.type || '',
            description: fromMultilang(currentRow?.description),
            isEdit,
          }
        : {
            name: emptyMultilang,
            type: '',
            description: emptyMultilang,
            isEdit: false,
          },
  })

  const createMutation = useCreateCategory({
    mutation: {
      onSuccess: () => {
        toast.success('Tạo danh mục thành công')
        form.reset()
        onOpenChange(false)
        queryClient.invalidateQueries({
          queryKey: [{ url: '/api/exercise-categories' }],
        })
      },
      onError: (error) => {
        toast.error('Tạo danh mục thất bại: ' + error.message)
      },
    },
  })

  const updateMutation = useUpdateCategory({
    mutation: {
      onSuccess: () => {
        toast.success('Cập nhật danh mục thành công')
        form.reset()
        onOpenChange(false)
        queryClient.invalidateQueries({
          queryKey: [{ url: '/api/exercise-categories' }],
        })
      },
      onError: (error) => {
        toast.error('Cập nhật danh mục thất bại: ' + error.message)
      },
    },
  })

  const onSubmit = (values: CategoryForm) => {
    if (isView) {
      onOpenChange(false)
      return
    }

    const payload = {
      name: toMultilang(values.name),
      type: values.type as NonNullable<CategoryResponse['type']>,
      description: toMultilang(values.description),
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
  }

  const getTitle = () => {
    if (isView) return 'Xem danh mục'
    if (isEdit) return 'Chỉnh sửa danh mục'
    return 'Thêm danh mục mới'
  }

  const getDescription = () => {
    if (isView) return 'Thông tin chi tiết danh mục bài tập.'
    if (isEdit) return 'Cập nhật thông tin danh mục. Nhấn lưu khi hoàn thành.'
    return 'Tạo danh mục bài tập mới. Nhấn lưu khi hoàn thành.'
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="text-start">
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="category-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                  <FormLabel className="col-span-2 text-end">
                    Tên danh mục
                  </FormLabel>
                  <FormControl>
                    <MultilangInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={{ vi: 'Nhập tên danh mục', en: 'Enter category name' }}
                      disabled={isView}
                      className="col-span-4"
                    />
                  </FormControl>
                  <FormMessage className="col-span-4 col-start-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                  <FormLabel className="col-span-2 text-end">
                    Phân loại
                  </FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder="Chọn phân loại"
                    className="col-span-4"
                    disabled={isView}
                    items={categoryTypeOptions}
                  />
                  <FormMessage className="col-span-4 col-start-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1">
                  <FormLabel className="col-span-2 text-end pt-2">
                    Mô tả
                  </FormLabel>
                  <FormControl>
                    <MultilangTextarea
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={{ vi: 'Nhập mô tả danh mục', en: 'Enter category description' }}
                      disabled={isView}
                      className="col-span-4"
                      textareaClassName="min-h-[100px]"
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
            <Button
              type="submit"
              form="category-form"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Đang lưu...'
                : 'Lưu'}
            </Button>
          )}
          {isView && <Button onClick={() => onOpenChange(false)}>Đóng</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
