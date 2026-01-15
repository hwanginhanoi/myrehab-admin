import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mail, User, Stethoscope, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import type { StaffResponse } from '@/api'

type DoctorInfoCardProps = {
  doctor: StaffResponse
  isLoading: boolean
}

export function DoctorInfoCard({ doctor, isLoading }: DoctorInfoCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Thông tin Bác sĩ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-center h-32'>
            <p className='text-sm text-muted-foreground'>Đang tải...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin Bác sĩ</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='flex items-start gap-3'>
            <User className='h-5 w-5 text-muted-foreground mt-0.5' />
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Họ và tên</p>
              <p className='text-base font-semibold'>{doctor.fullName || '-'}</p>
            </div>
          </div>

          <div className='flex items-start gap-3'>
            <Mail className='h-5 w-5 text-muted-foreground mt-0.5' />
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Email</p>
              <p className='text-base'>{doctor.email || '-'}</p>
            </div>
          </div>

          {doctor.specialization && (
            <div className='flex items-start gap-3'>
              <Stethoscope className='h-5 w-5 text-muted-foreground mt-0.5' />
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Chuyên môn</p>
                <p className='text-base'>{doctor.specialization}</p>
              </div>
            </div>
          )}

          <div className='flex items-start gap-3'>
            <div className='h-5 w-5 mt-0.5' />
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Trạng thái</p>
              <Badge variant={doctor.enabled ? 'default' : 'secondary'}>
                {doctor.enabled ? 'Hoạt động' : 'Vô hiệu hóa'}
              </Badge>
            </div>
          </div>
        </div>

        {doctor.createdAt && (
          <div className='flex items-start gap-3 pt-2 border-t'>
            <Calendar className='h-5 w-5 text-muted-foreground mt-0.5' />
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Ngày tạo</p>
              <p className='text-base'>
                {format(new Date(doctor.createdAt), 'dd/MM/yyyy HH:mm')}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
