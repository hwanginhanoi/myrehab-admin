import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { StaffLoginMutationRequest, StaffLoginMutationResponse } from "../../types/StaffLogin";

 /**
 * @description Login for doctors and admins using email and password
 * @summary Staff login
 * @link /api/auth/staff/login
 */
export async function staffLogin(data: StaffLoginMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<StaffLoginMutationResponse>["data"]> {
    const res = await client<StaffLoginMutationResponse, StaffLoginMutationRequest>({ method: "post", url: `/api/auth/staff/login`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}