import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetUserBasicInfoQueryResponse, GetUserBasicInfoPathParams } from "../../types/GetUserBasicInfo";

 /**
 * @description Admin can retrieve any user's basic information
 * @summary [Admin] Get user basic info
 * @link /api/users/:userId/basic-info
 */
export async function getUserBasicInfo(userId: GetUserBasicInfoPathParams["userId"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetUserBasicInfoQueryResponse>["data"]> {
    const res = await client<GetUserBasicInfoQueryResponse>({ method: "get", url: `/api/users/${userId}/basic-info`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}