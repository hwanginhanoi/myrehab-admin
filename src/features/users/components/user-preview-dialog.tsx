import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { type UserResponse } from '@/api'
import { genderLabels } from '@/lib/constants/gender'

type UserPreviewDialogProps = {
  user: UserResponse | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserPreviewDialog({
  user,
  open,
  onOpenChange,
}: UserPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Thông tin người dùng</DialogTitle>
          <DialogDescription>
            Chi tiết thông tin của người dùng
          </DialogDescription>
        </DialogHeader>
        {user ? (
          <div className='grid gap-4'>
            <div className='grid grid-cols-3 items-center gap-4'>
              <span className='text-sm font-medium text-muted-foreground'>
                Họ và tên
              </span>
              <span className='col-span-2 text-sm'>
                {user.fullName || '-'}
              </span>
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <span className='text-sm font-medium text-muted-foreground'>
                Email
              </span>
              <span className='col-span-2 text-sm'>
                {user.email || '-'}
              </span>
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <span className='text-sm font-medium text-muted-foreground'>
                Số điện thoại
              </span>
              <span className='col-span-2 text-sm'>
                {user.phoneNumber || '-'}
              </span>
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <span className='text-sm font-medium text-muted-foreground'>
                Giới tính
              </span>
              <span className='col-span-2 text-sm'>
                {user.gender ? (genderLabels[user.gender] || user.gender) : '-'}
              </span>
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <span className='text-sm font-medium text-muted-foreground'>
                Ngày sinh
              </span>
              <span className='col-span-2 text-sm'>
                {user.dateOfBirth
                  ? format(new Date(user.dateOfBirth), 'dd/MM/yyyy')
                  : '-'}
              </span>
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <span className='text-sm font-medium text-muted-foreground'>
                Trạng thái
              </span>
              <span className='col-span-2'>
                <Badge variant={user.enabled ? 'default' : 'secondary'}>
                  {user.enabled ? 'Hoạt động' : 'Vô hiệu'}
                </Badge>
              </span>
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <span className='text-sm font-medium text-muted-foreground'>
                Số dư
              </span>
              <span className='col-span-2 text-sm'>
                {user.balance != null ? user.balance.toLocaleString('vi-VN') : '-'}
              </span>
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <span className='text-sm font-medium text-muted-foreground'>
                Ngày tạo
              </span>
              <span className='col-span-2 text-sm'>
                {user.createdAt
                  ? format(new Date(user.createdAt), 'dd/MM/yyyy HH:mm')
                  : '-'}
              </span>
            </div>
          </div>
        ) : (
          <div className='flex h-48 items-center justify-center text-muted-foreground'>
            Không tìm thấy thông tin người dùng
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
