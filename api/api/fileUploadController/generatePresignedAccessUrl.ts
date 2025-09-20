import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GeneratePresignedAccessUrlQueryResponse, GeneratePresignedAccessUrlPathParams, GeneratePresignedAccessUrlQueryParams } from "../../types/GeneratePresignedAccessUrl";

 /**
 * @description Generate a presigned URL for temporary file access
 * @summary Generate presigned access URL
 * @link /api/files/presigned-url/:folder/:fileName
 */
export async function generatePresignedAccessUrl(folder: GeneratePresignedAccessUrlPathParams["folder"], fileName: GeneratePresignedAccessUrlPathParams["fileName"], params?: GeneratePresignedAccessUrlQueryParams, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GeneratePresignedAccessUrlQueryResponse>["data"]> {
    const res = await client<GeneratePresignedAccessUrlQueryResponse>({ method: "get", url: `/api/files/presigned-url/${folder}/${fileName}`, baseURL: "http://localhost:8080", params, ...options });
    return res.data;
}