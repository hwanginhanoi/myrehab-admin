import { format } from 'date-fns'
import { type UserResponse } from '@/api'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { genderLabels } from '@/lib/constants/gender'

function getInitials(name?: string) {
  if (!name) return '?'
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return words[0][0].toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

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
        <CardContent className='flex items-center gap-4 pt-6'>
          <Skeleton className='size-14 rounded-full' />
          <div className='space-y-2'>
            <Skeleton className='h-5 w-40' />
            <Skeleton className='h-4 w-28' />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className='h-4 w-32' />
        </CardHeader>
        <CardContent className='space-y-1 pt-0'>
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

type UserInfoSectionProps = {
  user: UserResponse
  isLoading: boolean
}

export function UserInfoSection({ user, isLoading }: UserInfoSectionProps) {
  if (isLoading) return <LoadingSkeleton />

  return (
    <div className='flex flex-1 flex-col gap-4 overflow-y-auto pb-12'>
      {/* Profile header */}
      <Card>
        <CardContent className='flex items-center gap-4 pt-6 pb-5'>
          <Avatar className='size-14 text-lg shrink-0'>
            <AvatarFallback className='bg-primary/10 text-primary font-bold text-base'>
              {getInitials(user.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className='min-w-0'>
            <div className='flex flex-wrap items-center gap-2'>
              <p className='truncate text-lg font-semibold'>
                {user.fullName || '—'}
              </p>
              <Badge
                variant={user.enabled ? 'default' : 'secondary'}
                className='h-5 shrink-0'
              >
                {user.enabled ? 'Hoạt động' : 'Vô hiệu'}
              </Badge>
            </div>
            <p className='truncate text-sm text-muted-foreground'>
              {user.phoneNumber || user.email || '—'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Detail description list */}
      <Card>
        <CardHeader className='pb-0'>
          <CardTitle className='text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
            Thông tin chi tiết
          </CardTitle>
        </CardHeader>
        <CardContent className='pt-0'>
          <dl className='divide-y'>
            <DescriptionRow label='Email'>
              {user.email || '—'}
            </DescriptionRow>
            <DescriptionRow label='Số điện thoại'>
              {user.phoneNumber || '—'}
            </DescriptionRow>
            <DescriptionRow label='Giới tính'>
              {user.gender ? (genderLabels[user.gender] || user.gender) : '—'}
            </DescriptionRow>
            <DescriptionRow label='Ngày sinh'>
              {user.dateOfBirth
                ? format(new Date(user.dateOfBirth), 'dd/MM/yyyy')
                : '—'}
            </DescriptionRow>
            <DescriptionRow label='Số dư'>
              {user.balance != null
                ? `${user.balance.toLocaleString('vi-VN')} ₫`
                : '—'}
            </DescriptionRow>
            <DescriptionRow label='Ngày tạo'>
              {user.createdAt
                ? format(new Date(user.createdAt), 'dd/MM/yyyy HH:mm')
                : '—'}
            </DescriptionRow>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
