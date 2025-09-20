import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { UploadImageMutationRequest, UploadImageMutationResponse } from "../../types/UploadImage";

 /**
 * @description Upload an image file for exercises (Admin and Doctor only)
 * @summary Upload exercise image
 * @link /api/files/upload/image
 */
export async function uploadImage(data: UploadImageMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<UploadImageMutationResponse>["data"]> {
    const formData = new FormData();
    if (data) {
        Object.keys(data).forEach((key) => {
            const value = data[key];
            if (typeof key === "string" && (typeof value === "string" || value instanceof Blob)) {
                formData.append(key, value);
            }
        });
    }
    const res = await client<UploadImageMutationResponse, UploadImageMutationRequest>({ method: "post", url: `/api/files/upload/image`, baseURL: "http://localhost:8080", data: formData, headers: { "Content-Type": "multipart/form-data", ...options.headers }, ...options });
    return res.data;
}