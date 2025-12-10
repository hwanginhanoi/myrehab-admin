'use client'

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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MultiSelect } from '@/components/multi-select'
import {
  type ExerciseResponse,
  useCreateExercise,
  useUpdateExercise,
  getAllExercisesQueryKey,
  useGetAllCategories,
  useGetAllGroups,
} from '@/api'
import { toast } from 'sonner'

const formSchema = z.object({
  title: z.string().min(1, 'Tên bài tập là bắt buộc'),
  description: z.string().optional(),
  imageUrl: z.string().min(1, 'Link ảnh là bắt buộc'),
  videoUrl: z.string().min(1, 'Link video là bắt buộc'),
  durationMinutes: z.coerce.number().min(1, 'Thời lượng phải lớn hơn 0'),
  categoryIds: z.array(z.string()).min(1, 'Vui lòng chọn ít nhất một danh mục'),
  groupIds: z.array(z.string()).min(1, 'Vui lòng chọn ít nhất một kho bài tập'),
})

type ExerciseForm = z.infer<typeof formSchema>

type ExerciseFormComponentProps = {
  exercise?: ExerciseResponse
  mode: 'create' | 'edit' | 'view'
}

export function ExerciseFormComponent({ exercise, mode }: ExerciseFormComponentProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isView = mode === 'view'
  const isEdit = mode === 'edit'

  // Fetch categories and groups for the multi-select
  const { data: categories = [] } = useGetAllCategories()
  const { data: groups = [] } = useGetAllGroups()

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
    defaultValues: exercise
      ? {
          title: exercise.title || '',
          description: exercise.description || '',
          imageUrl: exercise.imageUrl || '',
          videoUrl: exercise.videoUrl || '',
          durationMinutes: exercise.durationMinutes || undefined,
          categoryIds: exercise.categories?.map((c) => String(c.id)) || [],
          groupIds: exercise.groups?.map((g) => String(g.id)) || [],
        }
      : {
          title: '',
          description: '',
          imageUrl: '',
          videoUrl: '',
          durationMinutes: undefined,
          categoryIds: [],
          groupIds: [],
        },
  })

  const createMutation = useCreateExercise({
    mutation: {
      onSuccess: () => {
        toast.success('Tạo bài tập thành công')
        queryClient.invalidateQueries({ queryKey: getAllExercisesQueryKey() })
        navigate({ to: '/exercises' })
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
        queryClient.invalidateQueries({ queryKey: getAllExercisesQueryKey() })
        navigate({ to: '/exercises' })
      },
      onError: (error) => {
        toast.error('Cập nhật bài tập thất bại: ' + error.message)
      },
    },
  })

  const onSubmit = (values: ExerciseForm) => {
    const payload = {
      title: values.title,
      description: values.description,
      imageUrl: values.imageUrl,
      videoUrl: values.videoUrl,
      durationMinutes: values.durationMinutes,
      categoryIds: values.categoryIds?.map(Number) || [],
      groupIds: values.groupIds?.map(Number) || [],
    }

    if (isEdit && exercise?.id) {
      updateMutation.mutate({
        id: exercise.id,
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
    if (isEdit) return 'Cập nhật thông tin bài tập.'
    return 'Tạo bài tập phục hồi chức năng mới.'
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>{getTitle()}</h2>
        <p className='text-muted-foreground'>{getDescription()}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên bài tập</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Nhập tên bài tập'
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
              name='durationMinutes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời lượng (phút)</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Nhập thời lượng'
                      disabled={isView}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='categoryIds'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Danh mục</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={categoryOptions}
                    selected={field.value || []}
                    onChange={field.onChange}
                    placeholder='Chọn danh mục'
                    disabled={isView}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='groupIds'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kho bài tập</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={groupOptions}
                    selected={field.value || []}
                    onChange={field.onChange}
                    placeholder='Chọn kho bài tập'
                    disabled={isView}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Nhập mô tả bài tập'
                    className='min-h-[120px]'
                    disabled={isView}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <FormField
              control={form.control}
              name='imageUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link ảnh</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='https://example.com/image.jpg'
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
              name='videoUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link video</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='https://example.com/video.mp4'
                      disabled={isView}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='flex gap-3 justify-end pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => navigate({ to: '/exercises' })}
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
