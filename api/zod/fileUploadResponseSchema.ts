import { z } from "zod";


export const fileUploadResponseSchema = z.object({ "fileName": z.string().optional(), "originalFileName": z.string().optional(), "fileUrl": z.string().optional(), "fileType": z.string().optional(), "fileSize": z.number().int().optional(), "folder": z.string().optional() });