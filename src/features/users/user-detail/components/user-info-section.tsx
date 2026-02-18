import { format } from 'date-fns'
import { Calendar, CircleDollarSign, Clock, Mail, Phone, User } from 'lucide-react'
import { type UserResponse } from '@/api'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { genderLabels } from '@/lib/constants/gender'

function getInitials(name?: string) {
  if (!name) return '?'
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return words[0][0].toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

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
      {/* Profile card skeleton */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex items-center gap-4'>
            <Skeleton className='size-16 rounded-full' />
            <div className='flex-1 space-y-2'>
              <Skeleton className='h-6 w-48' />
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-4 w-36' />
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Detail cards skeleton */}
      <div className='grid gap-4 sm:grid-cols-2'>
        {[0, 1].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className='h-5 w-32' />
            </CardHeader>
            <CardContent className='space-y-4'>
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-10 w-full' />
            </CardContent>
          </Card>
        ))}
      </div>
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
      {/* Profile header card */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
            <Avatar className='size-16 text-xl'>
              <AvatarFallback className='bg-primary/10 text-primary font-semibold'>
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1 space-y-1'>
              <div className='flex flex-wrap items-center gap-2'>
                <h2 className='text-xl font-semibold'>
                  {user.fullName || 'Chưa cập nhật'}
                </h2>
                <Badge variant={user.enabled ? 'default' : 'secondary'} className='h-5'>
                  {user.enabled ? 'Hoạt động' : 'Vô hiệu'}
                </Badge>
              </div>
              <div className='flex flex-wrap gap-x-4 gap-y-1'>
                {user.email && (
                  <span className='flex items-center gap-1.5 text-sm text-muted-foreground'>
                    <Mail size={13} />
                    {user.email}
                  </span>
                )}
                {user.phoneNumber && (
                  <span className='flex items-center gap-1.5 text-sm text-muted-foreground'>
                    <Phone size={13} />
                    {user.phoneNumber}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail cards */}
      <div className='grid gap-4 sm:grid-cols-2'>
        {/* Personal info */}
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Thông tin cá nhân
            </CardTitle>
          </CardHeader>
          <Separator className='mx-6 mb-4 w-auto' />
          <CardContent className='space-y-4'>
            <InfoRow
              icon={<User size={15} />}
              label='Giới tính'
              value={user.gender ? (genderLabels[user.gender] || user.gender) : 'Chưa cập nhật'}
            />
            <InfoRow
              icon={<Calendar size={15} />}
              label='Ngày sinh'
              value={
                user.dateOfBirth
                  ? format(new Date(user.dateOfBirth), 'dd/MM/yyyy')
                  : 'Chưa cập nhật'
              }
            />
          </CardContent>
        </Card>

        {/* Account info */}
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Thông tin tài khoản
            </CardTitle>
          </CardHeader>
          <Separator className='mx-6 mb-4 w-auto' />
          <CardContent className='space-y-4'>
            <InfoRow
              icon={<CircleDollarSign size={15} />}
              label='Số dư'
              value={
                user.balance != null
                  ? `${user.balance.toLocaleString('vi-VN')} ₫`
                  : 'Chưa cập nhật'
              }
            />
            <InfoRow
              icon={<Clock size={15} />}
              label='Ngày tạo'
              value={
                user.createdAt
                  ? format(new Date(user.createdAt), 'dd/MM/yyyy HH:mm')
                  : 'Chưa cập nhật'
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
