import { z } from "zod";


export const userBasicInfoResponseSchema = z.object({ "id": z.number().int().optional(), "fullName": z.string().optional(), "gender": z.string().optional(), "dateOfBirth": z.string().date().optional(), "phoneNumber": z.string().optional(), "email": z.string().optional(), "createdAt": z.string().datetime().optional(), "updatedAt": z.string().datetime().optional() });