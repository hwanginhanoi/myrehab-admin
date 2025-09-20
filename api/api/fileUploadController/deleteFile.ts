import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { DeleteFileMutationResponse, DeleteFileQueryParams } from "../../types/DeleteFile";

 /**
 * @description Delete a file from S3 by URL (Admin and Doctor only)
 * @summary Delete file from S3
 * @link /api/files/delete
 */
export async function deleteFile(params: DeleteFileQueryParams, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<DeleteFileMutationResponse>["data"]> {
    const res = await client<DeleteFileMutationResponse>({ method: "delete", url: `/api/files/delete`, baseURL: "http://localhost:8080", params, ...options });
    return res.data;
}