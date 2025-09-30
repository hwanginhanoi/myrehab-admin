import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { AddBalanceToUserMutationRequest, AddBalanceToUserMutationResponse, AddBalanceToUserPathParams } from "../../types/AddBalanceToUser";

 /**
 * @description Add money to specific user's balance (Admin only)
 * @summary Add balance to user (Admin)
 * @link /api/balance/admin/add/:userId
 */
export async function addBalanceToUser(userId: AddBalanceToUserPathParams["userId"], data: AddBalanceToUserMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<AddBalanceToUserMutationResponse>["data"]> {
    const res = await client<AddBalanceToUserMutationResponse, AddBalanceToUserMutationRequest>({ method: "post", url: `/api/balance/admin/add/${userId}`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}