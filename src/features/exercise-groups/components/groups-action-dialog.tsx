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
import { type GroupResponse, useCreateGroup, useUpdateGroup } from '@/api'
import { toast } from 'sonner'

const formSchema = z.object({
  name: z.string().min(1, 'Tên nhóm là bắt buộc'),
  description: z.string().optional(),
  isEdit: z.boolean(),
})

type GroupForm = z.infer<typeof formSchema>

type GroupsActionDialogProps = {
  currentRow?: GroupResponse
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'add' | 'edit' | 'view'
}

export function GroupsActionDialog({
  currentRow,
  open,
  onOpenChange,
  mode,
}: GroupsActionDialogProps) {
  const isEdit = mode === 'edit'
  const isView = mode === 'view'

  const queryClient = useQueryClient()

  const form = useForm<GroupForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit || isView
      ? {
          name: currentRow?.name || '',
          description: currentRow?.description || '',
          isEdit,
        }
      : {
          name: '',
          description: '',
          isEdit: false,
        },
  })

  const createMutation = useCreateGroup({
    mutation: {
      onSuccess: () => {
        toast.success('Tạo nhóm thành công')
        form.reset()
        onOpenChange(false)
        queryClient.invalidateQueries({ queryKey: [{ url: '/api/exercise-groups' }] })
      },
      onError: (error) => {
        toast.error('Tạo nhóm thất bại: ' + error.message)
      },
    },
  })

  const updateMutation = useUpdateGroup({
    mutation: {
      onSuccess: () => {
        toast.success('Cập nhật nhóm thành công')
        form.reset()
        onOpenChange(false)
        queryClient.invalidateQueries({ queryKey: [{ url: '/api/exercise-groups' }] })
      },
      onError: (error) => {
        toast.error('Cập nhật nhóm thất bại: ' + error.message)
      },
    },
  })

  const onSubmit = (values: GroupForm) => {
    if (isView) {
      onOpenChange(false)
      return
    }

    const payload = {
      name: values.name,
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
    if (isView) return 'Xem nhóm'
    if (isEdit) return 'Chỉnh sửa nhóm'
    return 'Thêm nhóm mới'
  }

  const getDescription = () => {
    if (isView) return 'Thông tin chi tiết nhóm bài tập.'
    if (isEdit) return 'Cập nhật thông tin nhóm. Nhấn lưu khi hoàn thành.'
    return 'Tạo nhóm bài tập mới. Nhấn lưu khi hoàn thành.'
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
            id='group-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>
                    Tên nhóm
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Nhập tên nhóm'
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
              name='description'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end pt-2'>
                    Mô tả
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Nhập mô tả nhóm'
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
              form='group-form'
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
