import { createFileRoute } from '@tanstack/react-router'
import { useGetCompanyInfo } from '@/api'
import { CompanyInfoSection } from '@/features/users/user-detail/components/company-info-section'

function CompanyInfoRoute() {
  const { id } = Route.useParams()
  const { data, isLoading } = useGetCompanyInfo(Number(id))

  return <CompanyInfoSection data={data} isLoading={isLoading} />
}

export const Route = createFileRoute('/_authenticated/users/$id/company-info')({
  component: CompanyInfoRoute,
})
