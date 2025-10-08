import { z } from "zod";


export const nonCompulsoryHealthInsuranceResponseSchema = z.object({ "id": z.number().int().optional(), "userId": z.number().int().optional(), "insuranceNumber": z.string().optional(), "placeOfRegistration": z.string().optional(), "expiryDate": z.string().date().optional(), "createdAt": z.string().datetime().optional(), "updatedAt": z.string().datetime().optional() });