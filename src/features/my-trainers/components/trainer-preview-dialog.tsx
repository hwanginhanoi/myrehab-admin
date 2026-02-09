import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { type StaffResponse } from '@/api'

type TrainerPreviewDialogProps = {
  trainer: StaffResponse | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TrainerPreviewDialog({
  trainer,
  open,
  onOpenChange,
}: TrainerPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Thông tin huấn luyện viên</DialogTitle>
          <DialogDescription>
            Chi tiết thông tin của huấn luyện viên
          </DialogDescription>
        </DialogHeader>
        {trainer ? (
          <div className='grid gap-4'>
            <div className='grid grid-cols-3 items-center gap-4'>
              <span className='text-sm font-medium text-muted-foreground'>
                Họ và tên
              </span>
              <span className='col-span-2 text-sm'>
                {trainer.fullName || '-'}
              </span>
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <span className='text-sm font-medium text-muted-foreground'>
                Email
              </span>
              <span className='col-span-2 text-sm'>
                {trainer.email || '-'}
              </span>
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <span className='text-sm font-medium text-muted-foreground'>
                Số điện thoại
              </span>
              <span className='col-span-2 text-sm'>
                {trainer.phoneNumber || '-'}
              </span>
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <span className='text-sm font-medium text-muted-foreground'>
                Chuyên môn
              </span>
              <span className='col-span-2 text-sm'>
                {trainer.specialization || '-'}
              </span>
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <span className='text-sm font-medium text-muted-foreground'>
                Mô tả
              </span>
              <span className='col-span-2 text-sm'>
                {trainer.description || '-'}
              </span>
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <span className='text-sm font-medium text-muted-foreground'>
                Ngày tạo
              </span>
              <span className='col-span-2 text-sm'>
                {trainer.createdAt
                  ? format(new Date(trainer.createdAt), 'dd/MM/yyyy HH:mm')
                  : '-'}
              </span>
            </div>
          </div>
        ) : (
          <div className='flex h-48 items-center justify-center text-muted-foreground'>
            Không tìm thấy thông tin huấn luyện viên
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
