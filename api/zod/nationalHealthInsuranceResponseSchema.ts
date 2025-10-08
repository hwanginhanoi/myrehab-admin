import { z } from "zod";


export const nationalHealthInsuranceResponseSchema = z.object({ "id": z.number().int().optional(), "userId": z.number().int().optional(), "insuranceNumber": z.string().optional(), "placeOfRegistration": z.string().optional(), "createdAt": z.string().datetime().optional(), "updatedAt": z.string().datetime().optional() });