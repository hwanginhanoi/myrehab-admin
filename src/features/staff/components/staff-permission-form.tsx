'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown } from 'lucide-react'
import { useUpdateStaff, type StaffResponse } from '@/api'
import { getPermissionCategoriesByStaffType } from '../data/permissions'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  permissions: z.array(z.string()),
})

type FormValues = z.infer<typeof formSchema>

type StaffPermissionFormProps = {
  staff: StaffResponse
  readOnly?: boolean
}

export function StaffPermissionForm({ staff, readOnly }: StaffPermissionFormProps) {
  const queryClient = useQueryClient()
  const permissionCategories = getPermissionCategoriesByStaffType(staff.staffType || '')

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      permissions: staff.permissions || [],
    },
  })

  // Reset form when staff changes
  useEffect(() => {
    form.reset({
      permissions: staff.permissions || [],
    })
  }, [staff.permissions, form])

  const updateMutation = useUpdateStaff({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [{ url: '/api/admin/staff' }],
        })
        queryClient.invalidateQueries({
          queryKey: [{ url: `/api/admin/staff/${staff.id}` }],
        })
        toast.success('Đã cập nhật quyền thành công')
      },
      onError: (error) => {
        toast.error(error.message || 'Không thể cập nhật quyền')
      },
    },
  })

  const onSubmit = (values: FormValues) => {
    if (!staff.id || !staff.staffType) return

    updateMutation.mutate({
      id: staff.id,
      data: {
        staffType: staff.staffType as 'DOCTOR' | 'TRAINER' | 'ADMIN' | 'SUPER_ADMIN',
        email: staff.email || '',
        fullName: staff.fullName || '',
        permissions: values.permissions,
      },
    })
  }

  const selectedPermissions = form.watch('permissions')

  // Get count of selected permissions in a category
  const getCategorySelectedCount = (categoryId: string) => {
    const category = permissionCategories.find((c) => c.id === categoryId)
    if (!category) return { selected: 0, total: 0 }
    const selected = category.permissions.filter((p) =>
      selectedPermissions.includes(p.id)
    ).length
    return { selected, total: category.permissions.length }
  }

  // Check if all permissions in a category are selected
  const isCategoryFullySelected = (categoryId: string) => {
    const { selected, total } = getCategorySelectedCount(categoryId)
    return selected === total
  }

  // Toggle all permissions in a category
  const toggleCategory = (categoryId: string) => {
    const category = permissionCategories.find((c) => c.id === categoryId)
    if (!category) return

    const categoryPermissionIds = category.permissions.map((p) => p.id)
    const isFullySelected = isCategoryFullySelected(categoryId)

    if (isFullySelected) {
      const newPermissions = selectedPermissions.filter(
        (p) => !categoryPermissionIds.includes(p)
      )
      form.setValue('permissions', newPermissions, { shouldDirty: true })
    } else {
      const newPermissions = [
        ...selectedPermissions.filter(
          (p) => !categoryPermissionIds.includes(p)
        ),
        ...categoryPermissionIds,
      ]
      form.setValue('permissions', newPermissions, { shouldDirty: true })
    }
  }

  const isDirty = form.formState.isDirty

  if (permissionCategories.length === 0) {
    return (
      <div className='text-center py-8 text-muted-foreground'>
        Không có quyền nào có thể cấu hình cho loại nhân viên này.
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <div className='rounded-lg border'>
          {permissionCategories.map((category, index) => {
            const { selected, total } = getCategorySelectedCount(category.id)
            const isFullySelected = selected === total

            return (
              <Collapsible key={category.id} defaultOpen>
                <div
                  className={cn(
                    'flex items-center justify-between px-4 py-3',
                    index !== 0 && 'border-t'
                  )}
                >
                  <CollapsibleTrigger className='flex items-center gap-2 group flex-1 text-left'>
                    <ChevronDown className='h-4 w-4 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90' />
                    <div className='flex-1'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-medium'>
                          {category.title}
                        </span>
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                            selected === 0
                              ? 'bg-muted text-muted-foreground'
                              : isFullySelected
                                ? 'bg-primary/10 text-primary'
                                : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                          )}
                        >
                          {selected}/{total}
                        </span>
                      </div>
                      <p className='text-xs text-muted-foreground mt-0.5'>
                        {category.description}
                      </p>
                    </div>
                  </CollapsibleTrigger>

                  <Switch
                    checked={isFullySelected}
                    onCheckedChange={() => toggleCategory(category.id)}
                    disabled={readOnly}
                    aria-label={`Bật tất cả ${category.title}`}
                  />
                </div>

                <CollapsibleContent>
                  <div className='border-t bg-muted/30 px-4 py-4'>
                    <div className='space-y-2'>
                      {category.permissions.map((permission) => (
                        <FormField
                          key={permission.id}
                          control={form.control}
                          name='permissions'
                          render={({ field }) => {
                            const isChecked = field.value.includes(permission.id)
                            return (
                              <FormItem
                                className={cn(
                                  'flex items-center justify-between rounded-md px-3 py-3 transition-colors',
                                  isChecked
                                    ? 'bg-primary/5'
                                    : 'hover:bg-muted/50'
                                )}
                              >
                                <label
                                  htmlFor={permission.id}
                                  className='text-sm cursor-pointer flex-1'
                                >
                                  {permission.label}
                                </label>
                                <FormControl>
                                  <Switch
                                    id={permission.id}
                                    checked={isChecked}
                                    disabled={readOnly}
                                    onCheckedChange={(checked) => {
                                      const newValue = checked
                                        ? [...field.value, permission.id]
                                        : field.value.filter(
                                            (v) => v !== permission.id
                                          )
                                      field.onChange(newValue)
                                    }}
                                  />
                                </FormControl>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )
          })}
        </div>

        <div className='flex items-center justify-between pt-2'>
          <p className='text-sm text-muted-foreground'>
            Đã chọn{' '}
            <span className='font-medium text-foreground'>
              {selectedPermissions.length}
            </span>{' '}
            quyền
          </p>
          {!readOnly && (
            <div className='flex gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => form.reset()}
                disabled={!isDirty || updateMutation.isPending}
              >
                Hủy
              </Button>
              <Button
                type='submit'
                disabled={!isDirty || updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </div>
          )}
        </div>
      </form>
    </Form>
  )
}
