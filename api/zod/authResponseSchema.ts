import { z } from "zod";


export const authResponseSchema = z.object({ "token": z.string(), "refreshToken": z.string().optional(), "userId": z.number().int(), "email": z.string(), "firstName": z.string(), "lastName": z.string(), "role": z.string() });