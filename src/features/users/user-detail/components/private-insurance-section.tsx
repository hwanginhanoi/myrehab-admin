import { format, isPast } from 'date-fns'
import { ShieldCheck } from 'lucide-react'
import { type NonCompulsoryHealthInsuranceResponse } from '@/api'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

function DescriptionRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className='py-3 sm:grid sm:grid-cols-3 sm:gap-4'>
      <dt className='text-sm font-medium text-muted-foreground'>{label}</dt>
      <dd className='mt-1 text-sm sm:col-span-2 sm:mt-0'>{children}</dd>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className='flex flex-1 flex-col gap-4 overflow-y-auto pb-12'>
      <Card>
        <CardHeader>
          <Skeleton className='h-5 w-40' />
        </CardHeader>
        <CardContent className='pt-0'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='flex items-center justify-between py-3 border-b last:border-0'>
              <Skeleton className='h-4 w-28' />
              <Skeleton className='h-4 w-36' />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function EmptyState() {
  return (
    <div className='flex flex-1 flex-col gap-4 overflow-y-auto pb-12'>
      <Card>
        <CardContent className='flex flex-col items-center justify-center gap-2 py-16 text-center'>
          <ShieldCheck className='h-10 w-10 text-muted-foreground/40' />
          <p className='text-sm font-medium'>Chưa có thông tin bảo hiểm tư nhân</p>
          <p className='text-xs text-muted-foreground'>
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
        <CardHeader className='pb-0'>
          <div className='flex items-center gap-2'>
            <ShieldCheck className='h-4 w-4 text-emerald-500' />
            <CardTitle className='text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
              Bảo hiểm sức khỏe tư nhân
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className='pt-0'>
          <dl className='divide-y'>
            <DescriptionRow label='Số bảo hiểm'>
              <span className='font-mono'>{data.insuranceNumber || '—'}</span>
            </DescriptionRow>
            <DescriptionRow label='Nơi đăng ký'>
              {data.placeOfRegistration || '—'}
            </DescriptionRow>
            <DescriptionRow label='Ngày hết hạn'>
              <span className='inline-flex items-center gap-2'>
                {expiryDate ? format(expiryDate, 'dd/MM/yyyy') : '—'}
                {expiryDate && (
                  <Badge
                    variant={isExpired ? 'destructive' : 'default'}
                    className='h-5 text-xs'
                  >
                    {isExpired ? 'Đã hết hạn' : 'Còn hiệu lực'}
                  </Badge>
                )}
              </span>
            </DescriptionRow>
            <DescriptionRow label='Ngày tạo'>
              {data.createdAt
                ? format(new Date(data.createdAt), 'dd/MM/yyyy HH:mm')
                : '—'}
            </DescriptionRow>
            <DescriptionRow label='Cập nhật lần cuối'>
              {data.updatedAt
                ? format(new Date(data.updatedAt), 'dd/MM/yyyy HH:mm')
                : '—'}
            </DescriptionRow>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
