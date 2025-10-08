import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { UpdateMyBasicInfoMutationRequest, UpdateMyBasicInfoMutationResponse } from "../../types/UpdateMyBasicInfo";

 /**
 * @description Update your own basic information (name, email, gender, date of birth)
 * @summary Update my basic info
 * @link /api/users/me/basic-info
 */
export async function updateMyBasicInfo(data?: UpdateMyBasicInfoMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<UpdateMyBasicInfoMutationResponse>["data"]> {
    const res = await client<UpdateMyBasicInfoMutationResponse, UpdateMyBasicInfoMutationRequest>({ method: "put", url: `/api/users/me/basic-info`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}