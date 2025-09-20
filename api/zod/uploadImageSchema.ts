import { z } from "zod";
import { fileUploadResponseSchema } from "./fileUploadResponseSchema";

 /**
 * @description OK
 */
export const uploadImage200Schema = z.lazy(() => fileUploadResponseSchema);

 export const uploadImageMutationRequestSchema = z.object({ "file": z.string().describe("Image file to upload") });
/**
 * @description OK
 */
export const uploadImageMutationResponseSchema = z.lazy(() => fileUploadResponseSchema);