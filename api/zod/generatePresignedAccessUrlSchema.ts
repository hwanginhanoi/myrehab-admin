import { z } from "zod";


export const generatePresignedAccessUrlPathParamsSchema = z.object({ "folder": z.string(), "fileName": z.string() });

 export const generatePresignedAccessUrlQueryParamsSchema = z.object({ "durationMinutes": z.number().int().default(60).describe("URL expiration duration in minutes").optional() }).optional();
/**
 * @description OK
 */
export const generatePresignedAccessUrl200Schema = z.string();
/**
 * @description OK
 */
export const generatePresignedAccessUrlQueryResponseSchema = z.string();