import { createFileRoute } from '@tanstack/react-router'
import { useGetUserById } from '@/api'
import { UserInfoSection } from '@/features/users/user-detail/components/user-info-section'

function UserInfoRoute() {
  const { id } = Route.useParams()
  const { data: user, isLoading } = useGetUserById(Number(id))

  if (!user && !isLoading) {
    return null
  }

  return <UserInfoSection user={user ?? {}} isLoading={isLoading} />
}

export const Route = createFileRoute('/_authenticated/users/$id/')({
  component: UserInfoRoute,
})
