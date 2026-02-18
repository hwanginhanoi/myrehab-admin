import { createFileRoute } from '@tanstack/react-router'
import { useGetNonCompulsoryInsurance } from '@/api'
import { PrivateInsuranceSection } from '@/features/users/user-detail/components/private-insurance-section'

function PrivateInsuranceRoute() {
  const { id } = Route.useParams()
  const { data, isLoading } = useGetNonCompulsoryInsurance(Number(id))

  return <PrivateInsuranceSection data={data} isLoading={isLoading} />
}

export const Route = createFileRoute('/_authenticated/users/$id/private-insurance')({
  component: PrivateInsuranceRoute,
})
