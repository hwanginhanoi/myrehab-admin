import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GeneratePresignedUploadUrlMutationRequest, GeneratePresignedUploadUrlMutationResponse } from "../../types/GeneratePresignedUploadUrl";

 /**
 * @description Generate a presigned URL for direct upload to S3 (Admin and Doctor only)
 * @summary Generate presigned upload URL
 * @link /api/files/presigned-url
 */
export async function generatePresignedUploadUrl(data: GeneratePresignedUploadUrlMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GeneratePresignedUploadUrlMutationResponse>["data"]> {
    const res = await client<GeneratePresignedUploadUrlMutationResponse, GeneratePresignedUploadUrlMutationRequest>({ method: "post", url: `/api/files/presigned-url`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}