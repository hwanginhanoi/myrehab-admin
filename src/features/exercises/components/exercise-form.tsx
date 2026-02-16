'use client'

import { useMemo, useRef } from 'react'
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
import { GroupedMultiSelect } from '@/components/grouped-multi-select'
import { FileUpload, type FileUploadRef } from '@/components/file-upload'
import {
  type ExerciseResponse,
  type CategoryResponse,
  type GroupResponse,
  useCreateExercise,
  useUpdateExercise,
  useGetAllCategories,
  useGetAllGroups,
} from '@/api'
import { toast } from 'sonner'

const formSchema = z.object({
  title: z.string().min(1, 'Tên bài tập là bắt buộc'),
  description: z.string(),
  imageUrl: z.string(), // Can be empty if file is selected
  videoUrl: z.string(), // Can be empty if file is selected
  durationMinutes: z.number().min(1, 'Thời lượng phải lớn hơn 0'),
  categoryIds: z
    .array(z.string())
    .max(6, 'Chỉ được chọn tối đa 6 danh mục'),
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

  // Refs for file uploads
  const imageUploadRef = useRef<FileUploadRef>(null)
  const videoUploadRef = useRef<FileUploadRef>(null)

  // Fetch categories and groups for the multi-select (fetch all without pagination for dropdowns)
  const { data: categoriesResponse } = useGetAllCategories({
    pageable: {
      page: 0,
      size: 10000, // Get all categories
    },
  })
  const { data: groupsResponse } = useGetAllGroups({
    pageable: {
      page: 0,
      size: 10000, // Get all groups
    },
  })

  // Group categories by type
  const categoryGroups = useMemo(() => {
    const categories = (categoriesResponse?.content as CategoryResponse[]) || []
    const groupsMap = new Map<string, CategoryResponse[]>()

    categories.forEach((category) => {
      const type = category.type as string | undefined
      if (type && !groupsMap.has(type)) {
        groupsMap.set(type, [])
      }
      if (type) {
        groupsMap.get(type)?.push(category)
      }
    })

    // Convert to array format expected by the grouped multi-select
    return Array.from(groupsMap.entries()).map(([type, cats]) => ({
      label: getCategoryTypeLabel(type),
      options: cats
        .filter((cat) => cat.name !== undefined && cat.id !== undefined)
        .map((cat) => ({
          label: String(cat.name),
          value: String(cat.id),
        })),
    }))
  }, [categoriesResponse])

  // Wrap groups in a single group for consistent styling
  const groupOptions = useMemo(() => {
    const groups = (groupsResponse?.content as GroupResponse[]) || []
    return [{
      label: 'Kho bài tập',
      options: groups.map((group) => ({
        label: group.name || '',
        value: String(group.id),
      })),
    }]
  }, [groupsResponse])

  const form = useForm<ExerciseForm>({
    resolver: zodResolver(formSchema),
    defaultValues: exercise
      ? {
          title: exercise.title || '',
          description: exercise.description || '',
          imageUrl: exercise.imageUrl || '',
          videoUrl: exercise.videoUrl || '',
          durationMinutes: exercise.durationMinutes || 0,
          categoryIds: exercise.categories?.map((c) => String(c.id)) || [],
          groupIds: exercise.groups?.map((g) => String(g.id)) || [],
        }
      : {
          title: '',
          description: '',
          imageUrl: '',
          videoUrl: '',
          durationMinutes: 0,
          categoryIds: [],
          groupIds: [],
        },
  })

  const createMutation = useCreateExercise({
    mutation: {
      onSuccess: () => {
        toast.success('Tạo bài tập thành công')
        void queryClient.invalidateQueries({ queryKey: [{ url: '/api/exercises' }] })
        void navigate({ to: '/exercises', search: { categoryIds: undefined, groupIds: undefined } })
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
        void queryClient.invalidateQueries({ queryKey: [{ url: '/api/exercises' }] })
        void navigate({ to: '/exercises', search: { categoryIds: undefined, groupIds: undefined } })
      },
      onError: (error) => {
        toast.error('Cập nhật bài tập thất bại: ' + error.message)
      },
    },
  })

  const onSubmit = async (values: ExerciseForm) => {
    try {
      // Check if image is provided (either uploaded or new file)
      const hasImage = values.imageUrl || imageUploadRef.current?.hasFile()
      if (!hasImage) {
        toast.error('Vui lòng chọn ảnh bài tập')
        return
      }

      // Check if video is provided (either uploaded or new file)
      const hasVideo = values.videoUrl || videoUploadRef.current?.hasFile()
      if (!hasVideo) {
        toast.error('Vui lòng chọn video bài tập')
        return
      }

      // Upload files if they exist
      let imageUrl = values.imageUrl
      let videoUrl = values.videoUrl

      // Upload image if new file selected
      if (imageUploadRef.current?.hasFile()) {
        const uploadedImageKey = await imageUploadRef.current.upload()
        if (uploadedImageKey) {
          imageUrl = uploadedImageKey
        } else {
          toast.error('Không thể tải lên ảnh')
          return
        }
      }

      // Upload video if new file selected
      if (videoUploadRef.current?.hasFile()) {
        const uploadedVideoKey = await videoUploadRef.current.upload()
        if (uploadedVideoKey) {
          videoUrl = uploadedVideoKey
        } else {
          toast.error('Không thể tải lên video')
          return
        }
      }

      const payload = {
        title: values.title,
        description: values.description,
        imageUrl,
        videoUrl,
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
    } catch {
      toast.error('Có lỗi xảy ra khi tải lên file')
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
        <form
          // eslint-disable-next-line react-hooks/refs
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6'
        >
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
                      placeholder='Tự động từ video'
                      disabled={true}
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
                  <GroupedMultiSelect
                    groups={categoryGroups}
                    selected={field.value || []}
                    onChange={field.onChange}
                    placeholder='Chọn danh mục'
                    disabled={isView}
                    maxSelections={6}
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
                  <GroupedMultiSelect
                    groups={groupOptions}
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
                  <FormLabel>Ảnh bài tập</FormLabel>
                  <FormControl>
                    <FileUpload
                      ref={imageUploadRef}
                      category='exercise-image'
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

            <FormField
              control={form.control}
              name='videoUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video bài tập</FormLabel>
                  <FormControl>
                    <FileUpload
                      ref={videoUploadRef}
                      category='exercise-video'
                      value={field.value}
                      onChange={field.onChange}
                      onVideoDurationChange={(duration) => {
                        form.setValue('durationMinutes', duration)
                      }}
                      disabled={isView}
                      label={undefined}
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
              onClick={() => void navigate({ to: '/exercises', search: { categoryIds: undefined, groupIds: undefined } })}
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

// Helper function to get Vietnamese labels for category types
function getCategoryTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    BODY_PART: 'Bộ phận cơ thể',
    HEALTH_CONDITION: 'Tình trạng sức khỏe',
    EXERCISE_TYPE: 'Loại bài tập',
    EXERCISE_EQUIPMENTS: 'Dụng cụ tập luyện',
    OTHERS: 'Khác',
  }
  return labels[type] || type
}
