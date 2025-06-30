import { z } from "zod";


export const tokenRefreshRequestSchema = z.object({ "refreshToken": z.string() });