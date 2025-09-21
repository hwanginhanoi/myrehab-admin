import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GenerateVideoViewingUrlQueryResponse, GenerateVideoViewingUrlQueryParams } from "../../types/GenerateVideoViewingUrl";

 /**
 * @description Generate a short-lived presigned URL for video streaming (strict access)
 * @summary Generate presigned video viewing URL
 * @link /api/files/view/video
 */
export async function generateVideoViewingUrl(params: GenerateVideoViewingUrlQueryParams, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GenerateVideoViewingUrlQueryResponse>["data"]> {
    const res = await client<GenerateVideoViewingUrlQueryResponse>({ method: "get", url: `/api/files/view/video`, baseURL: "http://localhost:8080", params, ...options });
    return res.data;
}