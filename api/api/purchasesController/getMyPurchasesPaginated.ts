import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetMyPurchasesPaginatedQueryResponse, GetMyPurchasesPaginatedQueryParams } from "../../types/GetMyPurchasesPaginated";

 /**
 * @description Get current user's purchase history with pagination
 * @summary Get my purchases with pagination
 * @link /api/purchases/paginated
 */
export async function getMyPurchasesPaginated(params: GetMyPurchasesPaginatedQueryParams, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetMyPurchasesPaginatedQueryResponse>["data"]> {
    const res = await client<GetMyPurchasesPaginatedQueryResponse>({ method: "get", url: `/api/purchases/paginated`, baseURL: "http://localhost:8080", params, ...options });
    return res.data;
}