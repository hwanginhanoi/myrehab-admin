import { createFileRoute } from '@tanstack/react-router'
import { useGetNationalInsurance } from '@/api'
import { NationalInsuranceSection } from '@/features/users/user-detail/components/national-insurance-section'

function NationalInsuranceRoute() {
  const { id } = Route.useParams()
  const { data, isLoading } = useGetNationalInsurance(Number(id))

  return <NationalInsuranceSection data={data} isLoading={isLoading} />
}

export const Route = createFileRoute('/_authenticated/users/$id/national-insurance')({
  component: NationalInsuranceRoute,
})
