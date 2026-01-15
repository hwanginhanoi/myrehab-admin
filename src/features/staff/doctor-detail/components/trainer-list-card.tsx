import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { UserPlus, Trash2, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { useGetTrainersByDoctor, type TrainerResponse } from '@/api'
import { useDoctorDetail } from './doctor-detail-provider'

type TrainerListCardProps = {
  doctorId: number
}

export function TrainerListCard({ doctorId }: TrainerListCardProps) {
  const { setOpen, setCurrentTrainer } = useDoctorDetail()
  const { data: trainers, isLoading } = useGetTrainersByDoctor(doctorId)

  const handleRemoveClick = (trainer: TrainerResponse) => {
    setCurrentTrainer(trainer)
    setOpen('remove')
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
        <div className='flex items-center gap-2'>
          <CardTitle>Huấn luyện viên</CardTitle>
          {trainers && trainers.length > 0 && (
            <Badge variant='secondary' className='ml-2'>
              {trainers.length}
            </Badge>
          )}
        </div>
        <Button
          onClick={() => setOpen('assign')}
          size='sm'
          disabled={isLoading}
        >
          <UserPlus className='mr-2 h-4 w-4' />
          Gán huấn luyện viên
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='flex items-center justify-center h-32'>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            <p className='text-sm text-muted-foreground'>Đang tải...</p>
          </div>
        ) : trainers && trainers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ngày thêm</TableHead>
                <TableHead className='w-[100px]'>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainers.map((trainer) => (
                <TableRow key={trainer.id}>
                  <TableCell className='font-medium'>{trainer.fullName || '-'}</TableCell>
                  <TableCell>{trainer.email || '-'}</TableCell>
                  <TableCell>
                    {trainer.createdAt
                      ? format(new Date(trainer.createdAt), 'dd/MM/yyyy')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleRemoveClick(trainer)}
                      className='h-8 w-8 p-0 text-destructive hover:text-destructive'
                    >
                      <Trash2 className='h-4 w-4' />
                      <span className='sr-only'>Xóa huấn luyện viên</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className='flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg'>
            <p className='text-sm text-muted-foreground text-center'>
              Chưa có huấn luyện viên nào được gán.
              <br />
              Nhấn "Gán huấn luyện viên" để thêm.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
