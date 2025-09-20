import { z } from "zod";


export const presignedUrlResponseSchema = z.object({ "uploadUrl": z.string().optional(), "fileUrl": z.string().optional(), "fileName": z.string().optional(), "folder": z.string().optional(), "expiresAt": z.string().datetime().optional(), "contentType": z.string().optional() });