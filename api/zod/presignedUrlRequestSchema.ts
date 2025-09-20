import { z } from "zod";


export const presignedUrlRequestSchema = z.object({ "fileName": z.string().min(1), "contentType": z.string().regex(new RegExp("^(video|image)/.*")).min(1), "fileType": z.string().regex(new RegExp("^(video|image)$")).optional(), "durationMinutes": z.number().int().optional() });