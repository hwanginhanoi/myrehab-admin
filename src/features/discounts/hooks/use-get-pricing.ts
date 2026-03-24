import fetch, { type RequestConfig, type ResponseErrorConfig } from '@/lib/api-client'
import { queryOptions, useQuery } from '@tanstack/react-query'

export type DiscountPricingResponse = {
  applicableType: string
  originalPrice: number
  discountedPrice: number
  discountPercentage: number | null
  endDate: string | null
}

export type GetPricingQueryResponse = DiscountPricingResponse[]

export const getPricingQueryKey = () =>
  [{ url: '/api/discounts/pricing' }] as const

async function getPricing(
  config: Partial<RequestConfig> = {}
) {
  const res = await fetch<
    GetPricingQueryResponse,
    ResponseErrorConfig<Error>,
    unknown
  >({ method: 'GET', url: `/api/discounts/pricing`, ...config })
  return res.data
}

export function getPricingQueryOptions() {
  const queryKey = getPricingQueryKey()
  return queryOptions({
    queryKey,
    queryFn: async ({ signal }) => {
      return getPricing({ signal })
    },
  })
}

export function useGetPricing() {
  return useQuery(getPricingQueryOptions())
}
