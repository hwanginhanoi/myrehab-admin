import { z } from "zod";


export const generateVideoViewingUrlQueryParamsSchema = z.object({ "fileUrl": z.string().describe("Full video file URL"), "durationMinutes": z.number().int().default(5).describe("URL expiration duration in minutes").optional() });
/**
 * @description OK
 */
export const generateVideoViewingUrl200Schema = z.string();
/**
 * @description OK
 */
export const generateVideoViewingUrlQueryResponseSchema = z.string();