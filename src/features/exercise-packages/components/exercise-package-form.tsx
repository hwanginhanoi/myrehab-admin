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
import {
  type ExercisePackageDetailResponse,
  type ExerciseResponse,
  useCreateExercisePackage,
  useUpdateExercisePackage,
} from '@/api'
import { toast } from 'sonner'
import { ExerciseSelectorDND } from './exercise-selector-dnd'

const formSchema = z.object({
  title: z.string().min(1, 'Tên gói bài tập là bắt buộc'),
  description: z.string().min(1, 'Mô tả là bắt buộc'),
  imageUrl: z.string().optional(),
  exercises: z
    .array(z.custom<ExerciseResponse>())
    .min(1, 'Vui lòng chọn ít nhất một bài tập'),
})

type ExercisePackageForm = z.infer<typeof formSchema>

type ExercisePackageFormComponentProps = {
  exercisePackage?: ExercisePackageDetailResponse
  mode: 'create' | 'edit' | 'view'
}

export function ExercisePackageFormComponent({
  exercisePackage,
  mode,
}: ExercisePackageFormComponentProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isView = mode === 'view'
  const isEdit = mode === 'edit'

  const form = useForm<ExercisePackageForm>({
    resolver: zodResolver(formSchema),
    defaultValues: exercisePackage
      ? {
          title: exercisePackage.title || '',
          description: exercisePackage.description || '',
          imageUrl: exercisePackage.imageUrl || '',
          exercises: exercisePackage.exercises || [],
        }
      : {
          title: '',
          description: '',
          imageUrl: '',
          exercises: [],
        },
  })

  const createMutation = useCreateExercisePackage({
    mutation: {
      onSuccess: () => {
        toast.success('Tạo gói bài tập thành công')
        queryClient.invalidateQueries({ queryKey: [{ url: '/api/exercise-packages' }] })
        navigate({ to: '/exercise-packages' })
      },
      onError: (error) => {
        toast.error('Tạo gói bài tập thất bại: ' + error.message)
      },
    },
  })

  const updateMutation = useUpdateExercisePackage({
    mutation: {
      onSuccess: () => {
        toast.success('Cập nhật gói bài tập thành công')
        queryClient.invalidateQueries({ queryKey: [{ url: '/api/exercise-packages' }] })
        navigate({ to: '/exercise-packages' })
      },
      onError: (error) => {
        toast.error('Cập nhật gói bài tập thất bại: ' + error.message)
      },
    },
  })

  const onSubmit = (values: ExercisePackageForm) => {
    // Transform exercises array to exerciseIds array
    const payload = {
      title: values.title,
      description: values.description,
      imageUrl: values.imageUrl,
      exerciseIds: values.exercises.map((ex) => ex.id!),
    }

    if (isEdit && exercisePackage?.id) {
      updateMutation.mutate({
        id: exercisePackage.id,
        data: payload,
      })
    } else {
      createMutation.mutate({
        data: payload,
      })
    }
  }

  const getTitle = () => {
    if (isView) return 'Xem gói bài tập'
    if (isEdit) return 'Chỉnh sửa gói bài tập'
    return 'Thêm gói bài tập mới'
  }

  const getDescription = () => {
    if (isView) return 'Thông tin chi tiết gói bài tập phục hồi chức năng.'
    if (isEdit) return 'Cập nhật thông tin gói bài tập.'
    return 'Tạo gói bài tập phục hồi chức năng mới.'
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
                  <FormLabel>Tên gói bài tập</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Nhập tên gói bài tập'
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
              name='imageUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link ảnh (tùy chọn)</FormLabel>
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
          </div>

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Nhập mô tả gói bài tập'
                    className='min-h-[120px]'
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
            name='exercises'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bài tập</FormLabel>
                <FormControl>
                  <ExerciseSelectorDND
                    selectedExercises={field.value || []}
                    onChange={field.onChange}
                    disabled={isView}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex gap-3 justify-end pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => navigate({ to: '/exercise-packages' })}
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
