'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { toast } from 'sonner'
import { useDisableStaff, type StaffResponse } from '@/api'
import { getStaffTypeLabel } from '../data/staff-roles'

type StaffDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: StaffResponse
}

export function StaffDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: StaffDeleteDialogProps) {
  const [value, setValue] = useState('')
  const queryClient = useQueryClient()

  const deleteMutation = useDisableStaff({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [{ url: '/api/admin/staff' }] })
        toast.success('Đã vô hiệu hóa nhân viên')
        setValue('')
        onOpenChange(false)
      },
      onError: (error) => {
        toast.error(error.message || 'Không thể xóa nhân viên')
      },
    },
  })

  const handleDelete = () => {
    if (value.trim() !== currentRow.email || !currentRow.id) return
    deleteMutation.mutate({ id: currentRow.id })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(state) => {
        setValue('')
        onOpenChange(state)
      }}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.email || deleteMutation.isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          Xóa nhân viên
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Bạn có chắc chắn muốn xóa nhân viên{' '}
            <span className='font-bold'>{currentRow.fullName}</span>?
            <br />
            Hành động này sẽ vô hiệu hóa vĩnh viễn tài khoản với vai trò{' '}
            <span className='font-bold'>
              {getStaffTypeLabel(currentRow.staffType || '')}
            </span>
            . Thao tác này không thể hoàn tác.
          </p>

          <Label className='my-2'>
            Email:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Nhập email để xác nhận xóa'
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Cảnh báo!</AlertTitle>
            <AlertDescription>
              Vui lòng cẩn thận, thao tác này không thể hoàn tác.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
      destructive
    />
  )
}
