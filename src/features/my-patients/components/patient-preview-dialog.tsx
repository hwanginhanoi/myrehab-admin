import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useGetUserById, type DoctorPatientResponse } from '@/api'

type PatientPreviewDialogProps = {
  patient: DoctorPatientResponse | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PatientPreviewDialog({
  patient,
  open,
  onOpenChange,
}: PatientPreviewDialogProps) {
  const { data: userDetails, isLoading } = useGetUserById(patient?.userId ?? 0, {
    query: {
      enabled: !!patient?.userId && open,
    },
  })

  const formatGender = (gender: string | undefined) => {
    if (!gender) return '-'
    if (gender === 'MALE') return 'Nam'
    if (gender === 'FEMALE') return 'Nữ'
    return gender
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Thông tin bệnh nhân</DialogTitle>
          <DialogDescription>
            Chi tiết thông tin của bệnh nhân
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className='flex h-48 items-center justify-center'>
            <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
          </div>
        ) : userDetails ? (
          <div className='grid gap-4'>
            <div className='grid grid-cols-3 items-center gap-4'>
              <span className='text-sm font-medium text-muted-foreground'>
                Họ và tên
              </span>
              <span className='col-span-2 text-sm'>
                {userDetails.fullName || '-'}
              </span>
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <span className='text-sm font-medium text-muted-foreground'>
                Giới tính
              </span>
              <span className='col-span-2 text-sm'>
                {formatGender(userDetails.gender)}
              </span>
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <span className='text-sm font-medium text-muted-foreground'>
                Ngày sinh
              </span>
              <span className='col-span-2 text-sm'>
                {userDetails.dateOfBirth
                  ? format(new Date(userDetails.dateOfBirth), 'dd/MM/yyyy')
                  : '-'}
              </span>
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <span className='text-sm font-medium text-muted-foreground'>
                Số điện thoại
              </span>
              <span className='col-span-2 text-sm'>
                {userDetails.phoneNumber || '-'}
              </span>
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <span className='text-sm font-medium text-muted-foreground'>
                Email
              </span>
              <span className='col-span-2 text-sm'>
                {userDetails.email || '-'}
              </span>
            </div>
          </div>
        ) : (
          <div className='flex h-48 items-center justify-center text-muted-foreground'>
            Không tìm thấy thông tin bệnh nhân
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
