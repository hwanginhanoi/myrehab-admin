'use client'

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
import { categoryTypeOptions } from '@/lib/constants/category-type'
import { type CategoryResponse, useCreateCategory, useUpdateCategory, getAllCategoriesQueryKey } from '@/api'
import { toast } from 'sonner'

const formSchema = z.object({
  name: z.string().min(1, 'Tên danh mục là bắt buộc'),
  type: z.string().min(1, 'Phân loại là bắt buộc'),
  description: z.string().optional(),
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
    defaultValues: isEdit || isView
        ? {
          name: currentRow?.name || '',
          type: currentRow?.type || '',
          description: currentRow?.description || '',
          isEdit,
        }
        : {
          name: '',
          type: '',
          description: '',
          isEdit: false,
        },
  })

  const createMutation = useCreateCategory({
    mutation: {
      onSuccess: () => {
        toast.success('Tạo danh mục thành công')
        form.reset()
        onOpenChange(false)
        queryClient.invalidateQueries({ queryKey: getAllCategoriesQueryKey() })
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
        queryClient.invalidateQueries({ queryKey: getAllCategoriesQueryKey() })
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
      name: values.name,
      type: values.type as CategoryResponse['type'],
      description: values.description,
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
        <DialogContent className='sm:max-w-3xl max-h-[85vh] overflow-y-auto'>
          <DialogHeader className='text-start'>
            <DialogTitle>{getTitle()}</DialogTitle>
            <DialogDescription>{getDescription()}</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
                id='category-form'
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
            >
              <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-end'>
                          Tên danh mục
                        </FormLabel>
                        <FormControl>
                          <Input
                              placeholder='Nhập tên danh mục'
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
                  name='type'
                  render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-end'>Phân loại</FormLabel>
                        <SelectDropdown
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder='Chọn phân loại'
                            className='col-span-4'
                            disabled={isView}
                            items={categoryTypeOptions}
                        />
                        <FormMessage className='col-span-4 col-start-3' />
                      </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-end pt-2'>
                          Mô tả
                        </FormLabel>
                        <FormControl>
                          <Textarea
                              placeholder='Nhập mô tả danh mục'
                              className='col-span-4 min-h-[100px]'
                              disabled={isView}
                              {...field}
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
                    form='category-form'
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
