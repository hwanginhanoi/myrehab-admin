import { z } from "zod";


export const nonCompulsoryHealthInsuranceRequestSchema = z.object({ "insuranceNumber": z.string().optional(), "placeOfRegistration": z.string().optional(), "expiryDate": z.string().date().optional() });