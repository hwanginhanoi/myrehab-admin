import { format } from 'date-fns'
import { Building2, Clock, MapPin, ReceiptText } from 'lucide-react'
import { type CompanyInfoResponse } from '@/api'
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
        <p className='break-words text-sm font-medium'>{value}</p>
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
            <Building2 size={28} className='text-muted-foreground' />
          </div>
          <h3 className='mb-1 text-base font-semibold'>Chưa có thông tin công ty</h3>
          <p className='text-sm text-muted-foreground'>
            Người dùng chưa cập nhật thông tin công ty.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

type CompanyInfoSectionProps = {
  data: CompanyInfoResponse | undefined
  isLoading: boolean
}

export function CompanyInfoSection({ data, isLoading }: CompanyInfoSectionProps) {
  if (isLoading) return <LoadingSkeleton />
  if (!data) return <EmptyState />

  return (
    <div className='flex flex-1 flex-col gap-4 overflow-y-auto pb-12'>
      <Card>
        <CardHeader className='pb-2'>
          <div className='flex items-center gap-2'>
            <div className='flex size-8 items-center justify-center rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400'>
              <Building2 size={16} />
            </div>
            <CardTitle className='text-base'>Thông tin công ty</CardTitle>
          </div>
        </CardHeader>
        <Separator className='mx-6 mb-2 w-auto' />
        <CardContent className='space-y-4 pt-4'>
          <InfoRow
            icon={<Building2 size={15} />}
            label='Tên công ty'
            value={data.companyName || 'Chưa cập nhật'}
          />
          <InfoRow
            icon={<ReceiptText size={15} />}
            label='Mã số thuế'
            value={data.companyTaxNumber || 'Chưa cập nhật'}
          />
          <InfoRow
            icon={<MapPin size={15} />}
            label='Địa chỉ xuất hoá đơn'
            value={data.invoiceIssuanceAddress || 'Chưa cập nhật'}
          />
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
