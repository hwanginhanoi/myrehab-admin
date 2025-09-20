import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { UploadVideoMutationRequest, UploadVideoMutationResponse } from "../../types/UploadVideo";

 /**
 * @description Upload a video file for exercises (Admin and Doctor only)
 * @summary Upload exercise video
 * @link /api/files/upload/video
 */
export async function uploadVideo(data: UploadVideoMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<UploadVideoMutationResponse>["data"]> {
    const formData = new FormData();
    if (data) {
        Object.keys(data).forEach((key) => {
            const value = data[key];
            if (typeof key === "string" && (typeof value === "string" || value instanceof Blob)) {
                formData.append(key, value);
            }
        });
    }
    const res = await client<UploadVideoMutationResponse, UploadVideoMutationRequest>({ method: "post", url: `/api/files/upload/video`, baseURL: "http://localhost:8080", data: formData, headers: { "Content-Type": "multipart/form-data", ...options.headers }, ...options });
    return res.data;
}