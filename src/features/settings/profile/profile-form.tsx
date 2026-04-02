import { useGetMyProfile } from '@/api/hooks/Staff ManagementHooks/useGetMyProfile'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

function ProfileField({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-sm">{value ?? '—'}</p>
    </div>
  )
}

export function ProfileForm() {
  const { data, isPending } = useGetMyProfile()

  if (isPending) {
    return <p className="text-sm text-muted-foreground">Đang tải hồ sơ…</p>
  }

  if (!data) {
    return (
      <p className="text-sm text-muted-foreground">Không thể tải hồ sơ.</p>
    )
  }

  const initials = data.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={data.profileImageUrl} alt={data.fullName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-semibold">{data.fullName}</p>
          <Badge variant="outline">{data.staffType}</Badge>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4 sm:grid-cols-2">
        <ProfileField label="Email" value={data.email} />
        <ProfileField label="Số điện thoại" value={data.phoneNumber} />
      </div>

      {(data.staffType === 'DOCTOR' || data.specialization || data.description) && (
        <>
          <Separator />
          <div className="grid gap-4 sm:grid-cols-2">
            <ProfileField label="Chuyên môn" value={data.specialization} />
            <ProfileField
              label="Hồ sơ công khai"
              value={data.isPublic ? 'Có' : 'Không'}
            />
          </div>
          {data.description && (
            <ProfileField label="Giới thiệu" value={data.description} />
          )}
        </>
      )}

      {data.staffType === 'TRAINER' && data.doctorId && (
        <>
          <Separator />
          <ProfileField
            label="Mã bác sĩ phụ trách"
            value={String(data.doctorId)}
          />
        </>
      )}


    </div>
  )
}
