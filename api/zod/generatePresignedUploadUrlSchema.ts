import { z } from "zod";
import { presignedUrlResponseSchema } from "./presignedUrlResponseSchema";
import { presignedUrlRequestSchema } from "./presignedUrlRequestSchema";

 /**
 * @description OK
 */
export const generatePresignedUploadUrl200Schema = z.lazy(() => presignedUrlResponseSchema);

 export const generatePresignedUploadUrlMutationRequestSchema = z.lazy(() => presignedUrlRequestSchema);
/**
 * @description OK
 */
export const generatePresignedUploadUrlMutationResponseSchema = z.lazy(() => presignedUrlResponseSchema);