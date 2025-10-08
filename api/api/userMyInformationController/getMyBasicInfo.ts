import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetMyBasicInfoQueryResponse } from "../../types/GetMyBasicInfo";

 /**
 * @description Retrieve your own basic information (name, email, phone, etc.)
 * @summary Get my basic info
 * @link /api/users/me/basic-info
 */
export async function getMyBasicInfo(options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetMyBasicInfoQueryResponse>["data"]> {
    const res = await client<GetMyBasicInfoQueryResponse>({ method: "get", url: `/api/users/me/basic-info`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}