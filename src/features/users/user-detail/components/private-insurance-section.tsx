import { format, isPast } from 'date-fns'
import { AlertCircle, Calendar, Clock, CreditCard, MapPin, ShieldCheck } from 'lucide-react'
import { type NonCompulsoryHealthInsuranceResponse } from '@/api'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  return (
    <div className='flex items-start gap-3'>
      <div className='mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground'>
        {icon}
      </div>
      <div className='min-w-0 flex-1'>
        <p className='text-xs text-muted-foreground'>{label}</p>
        <p className='truncate text-sm font-medium'>{value}</p>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className='flex flex-1 flex-col gap-4 overflow-y-auto pb-12'>
      <Card>
        <CardHeader>
          <Skeleton className='h-5 w-36' />
        </CardHeader>
        <CardContent className='space-y-4'>
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-10 w-full' />
          <Separator />
          <Skeleton className='h-4 w-48' />
          <Skeleton className='h-4 w-48' />
        </CardContent>
      </Card>
    </div>
  )
}

function EmptyState() {
  return (
    <div className='flex flex-1 flex-col gap-4 overflow-y-auto pb-12'>
      <Card>
        <CardContent className='flex flex-col items-center justify-center py-16 text-center'>
          <div className='mb-4 flex size-16 items-center justify-center rounded-full bg-muted'>
            <ShieldCheck size={28} className='text-muted-foreground' />
          </div>
          <h3 className='mb-1 text-base font-semibold'>Chưa có thông tin bảo hiểm tư nhân</h3>
          <p className='text-sm text-muted-foreground'>
            Người dùng chưa cập nhật thông tin bảo hiểm sức khỏe tư nhân.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

type PrivateInsuranceSectionProps = {
  data: NonCompulsoryHealthInsuranceResponse | undefined
  isLoading: boolean
}

export function PrivateInsuranceSection({ data, isLoading }: PrivateInsuranceSectionProps) {
  if (isLoading) return <LoadingSkeleton />
  if (!data) return <EmptyState />

  const expiryDate = data.expiryDate ? new Date(data.expiryDate) : null
  const isExpired = expiryDate ? isPast(expiryDate) : false

  return (
    <div className='flex flex-1 flex-col gap-4 overflow-y-auto pb-12'>
      <Card>
        <CardHeader className='pb-2'>
          <div className='flex items-center gap-2'>
            <div className='flex size-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'>
              <ShieldCheck size={16} />
            </div>
            <CardTitle className='text-base'>Bảo hiểm sức khỏe tư nhân</CardTitle>
          </div>
        </CardHeader>
        <Separator className='mx-6 mb-2 w-auto' />
        <CardContent className='space-y-4 pt-4'>
          <InfoRow
            icon={<CreditCard size={15} />}
            label='Số bảo hiểm'
            value={data.insuranceNumber || 'Chưa cập nhật'}
          />
          <InfoRow
            icon={<MapPin size={15} />}
            label='Nơi đăng ký'
            value={data.placeOfRegistration || 'Chưa cập nhật'}
          />
          <div className='flex items-start gap-3'>
            <div className='mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground'>
              <Calendar size={15} />
            </div>
            <div className='min-w-0 flex-1'>
              <p className='text-xs text-muted-foreground'>Ngày hết hạn</p>
              <div className='flex items-center gap-2'>
                <p className='text-sm font-medium'>
                  {expiryDate ? format(expiryDate, 'dd/MM/yyyy') : 'Chưa cập nhật'}
                </p>
                {expiryDate && (
                  <Badge
                    variant={isExpired ? 'destructive' : 'default'}
                    className='h-5 gap-1 text-xs'
                  >
                    {isExpired && <AlertCircle size={10} />}
                    {isExpired ? 'Đã hết hạn' : 'Còn hiệu lực'}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Separator />
          <div className='grid gap-2 sm:grid-cols-2'>
            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
              <Clock size={12} />
              <span>
                Ngày tạo:{' '}
                <span className='font-medium text-foreground'>
                  {data.createdAt
                    ? format(new Date(data.createdAt), 'dd/MM/yyyy HH:mm')
                    : '—'}
                </span>
              </span>
            </div>
            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
              <Clock size={12} />
              <span>
                Cập nhật:{' '}
                <span className='font-medium text-foreground'>
                  {data.updatedAt
                    ? format(new Date(data.updatedAt), 'dd/MM/yyyy HH:mm')
                    : '—'}
                </span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
