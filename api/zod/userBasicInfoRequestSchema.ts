import { z } from "zod";


export const userBasicInfoRequestSchema = z.object({ "fullName": z.string().optional(), "gender": z.string().optional(), "dateOfBirth": z.string().date().optional(), "phoneNumber": z.string().optional(), "email": z.string().optional() });