import { z } from "zod";
import { fileUploadResponseSchema } from "./fileUploadResponseSchema";

 /**
 * @description OK
 */
export const uploadVideo200Schema = z.lazy(() => fileUploadResponseSchema);

 export const uploadVideoMutationRequestSchema = z.object({ "file": z.string().describe("Video file to upload") });
/**
 * @description OK
 */
export const uploadVideoMutationResponseSchema = z.lazy(() => fileUploadResponseSchema);