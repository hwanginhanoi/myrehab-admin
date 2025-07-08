import { z } from "zod";


export const registerRequestSchema = z.object({ "firstName": z.string().optional(), "lastName": z.string().optional(), "email": z.string().optional(), "password": z.string().optional() });