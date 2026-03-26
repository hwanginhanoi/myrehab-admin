import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import { IntakeHistorySection } from '@/features/users/user-detail/components/intake-history-section'

const route = getRouteApi('/_authenticated/users/$id')

function IntakeHistoryPage() {
  const { id } = route.useParams()
  return <IntakeHistorySection userId={Number(id)} />
}

export const Route = createFileRoute('/_authenticated/users/$id/intake-history')({
  component: IntakeHistoryPage,
})
