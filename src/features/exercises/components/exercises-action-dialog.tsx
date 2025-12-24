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
import { MultiSelect } from '@/components/multi-select'
import {
  type ExerciseResponse,
  useCreateExercise,
  useUpdateExercise,
  useGetAllCategories,
  useGetAllGroups,
} from '@/api'
import { toast } from 'sonner'

const formSchema = z.object({
  title: z.string().min(1, 'Tên bài tập là bắt buộc'),
  description: z.string().min(1, 'Mô tả là bắt buộc'),
  imageUrl: z.string().min(1, 'Link ảnh là bắt buộc'),
  videoUrl: z.string().min(1, 'Link video là bắt buộc'),
  durationMinutes: z.number().min(1, 'Thời lượng phải lớn hơn 0'),
  categoryIds: z.array(z.string()),
  groupIds: z.array(z.string()),
  isEdit: z.boolean(),
})

type ExerciseForm = z.infer<typeof formSchema>

type ExercisesActionDialogProps = {
  currentRow?: ExerciseResponse
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'add' | 'edit' | 'view'
}

export function ExercisesActionDialog({
  currentRow,
  open,
  onOpenChange,
  mode,
}: ExercisesActionDialogProps) {
  const isEdit = mode === 'edit'
  const isView = mode === 'view'

  const queryClient = useQueryClient()

  // Fetch categories and groups for the multi-select (fetch all without pagination for dropdowns)
  const { data: categoriesResponse } = useGetAllCategories({
    pageable: { page: 0, size: 1000 },
  })
  const { data: groupsResponse } = useGetAllGroups({
    pageable: { page: 0, size: 1000 },
  })

  const categories = categoriesResponse?.content || []
  const groups = groupsResponse?.content || []

  const categoryOptions = categories.map((cat) => ({
    label: cat.name || '',
    value: String(cat.id),
  }))

  const groupOptions = groups.map((group) => ({
    label: group.name || '',
    value: String(group.id),
  }))

  const form = useForm<ExerciseForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit || isView
      ? {
          title: currentRow?.title || '',
          description: currentRow?.description || '',
          imageUrl: currentRow?.imageUrl || '',
          videoUrl: currentRow?.videoUrl || '',
          durationMinutes: currentRow?.durationMinutes || 0,
          categoryIds: currentRow?.categories?.map((c) => String(c.id)) || [],
          groupIds: currentRow?.groups?.map((g) => String(g.id)) || [],
          isEdit,
        }
      : {
          title: '',
          description: '',
          imageUrl: '',
          videoUrl: '',
          durationMinutes: 0,
          categoryIds: [],
          groupIds: [],
          isEdit: false,
        },
  })

  const createMutation = useCreateExercise({
    mutation: {
      onSuccess: () => {
        toast.success('Tạo bài tập thành công')
        form.reset()
        onOpenChange(false)
        queryClient.invalidateQueries({ queryKey: [{ url: '/api/exercises' }] })
      },
      onError: (error) => {
        toast.error('Tạo bài tập thất bại: ' + error.message)
      },
    },
  })

  const updateMutation = useUpdateExercise({
    mutation: {
      onSuccess: () => {
        toast.success('Cập nhật bài tập thành công')
        form.reset()
        onOpenChange(false)
        queryClient.invalidateQueries({ queryKey: [{ url: '/api/exercises' }] })
      },
      onError: (error) => {
        toast.error('Cập nhật bài tập thất bại: ' + error.message)
      },
    },
  })

  const onSubmit = (values: ExerciseForm) => {
    if (isView) {
      onOpenChange(false)
      return
    }

    const payload = {
      title: values.title,
      description: values.description,
      imageUrl: values.imageUrl,
      videoUrl: values.videoUrl,
      durationMinutes: values.durationMinutes,
      categoryIds: values.categoryIds?.map(Number) || [],
      groupIds: values.groupIds?.map(Number) || [],
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
    if (isView) return 'Xem bài tập'
    if (isEdit) return 'Chỉnh sửa bài tập'
    return 'Thêm bài tập mới'
  }

  const getDescription = () => {
    if (isView) return 'Thông tin chi tiết bài tập phục hồi chức năng.'
    if (isEdit) return 'Cập nhật thông tin bài tập. Nhấn lưu khi hoàn thành.'
    return 'Tạo bài tập phục hồi chức năng mới. Nhấn lưu khi hoàn thành.'
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader className='text-start'>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='exercise-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>
                    Tên bài tập
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Nhập tên bài tập'
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
              name='categoryIds'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>Danh mục</FormLabel>
                  <FormControl>
                    <div className='col-span-4'>
                      <MultiSelect
                        options={categoryOptions}
                        selected={field.value || []}
                        onChange={field.onChange}
                        placeholder='Chọn danh mục'
                        disabled={isView}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='groupIds'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>Kho bài tập</FormLabel>
                  <FormControl>
                    <div className='col-span-4'>
                      <MultiSelect
                        options={groupOptions}
                        selected={field.value || []}
                        onChange={field.onChange}
                        placeholder='Chọn kho bài tập'
                        disabled={isView}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='durationMinutes'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>
                    Thời lượng (phút)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Nhập thời lượng'
                      className='col-span-4'
                      disabled={isView}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
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
                      placeholder='Nhập mô tả bài tập'
                      className='col-span-4 min-h-[100px]'
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
              name='imageUrl'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>
                    Link ảnh
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='https://example.com/image.jpg'
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
              name='videoUrl'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>
                    Link video
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='https://example.com/video.mp4'
                      className='col-span-4'
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
              form='exercise-form'
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
