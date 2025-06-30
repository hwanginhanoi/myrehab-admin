import { z } from "zod";


export const registerRequestSchema = z.object({ "email": z.string().min(1), "password": z.string().min(8).max(2147483647), "firstName": z.string().min(1), "lastName": z.string().min(1), "dateOfBirth": z.string().optional(), "phone": z.string().regex(new RegExp("^\\d{10}$")).optional() });