import { format } from 'date-fns'
import { Building2 } from 'lucide-react'
import { type CompanyInfoResponse } from '@/api'
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
          <Building2 className='h-10 w-10 text-muted-foreground/40' />
          <p className='text-sm font-medium'>Chưa có thông tin công ty</p>
          <p className='text-xs text-muted-foreground'>
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
        <CardHeader className='pb-0'>
          <div className='flex items-center gap-2'>
            <Building2 className='h-4 w-4 text-orange-500' />
            <CardTitle className='text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
              Thông tin công ty
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className='pt-0'>
          <dl className='divide-y'>
            <DescriptionRow label='Tên công ty'>
              {data.companyName || '—'}
            </DescriptionRow>
            <DescriptionRow label='Mã số thuế'>
              <span className='font-mono'>{data.companyTaxNumber || '—'}</span>
            </DescriptionRow>
            <DescriptionRow label='Địa chỉ xuất hoá đơn'>
              {data.invoiceIssuanceAddress || '—'}
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
