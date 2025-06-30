import { z } from "zod";


export const tokenRefreshResponseSchema = z.object({ "accessToken": z.string(), "refreshToken": z.string(), "tokenType": z.string() });