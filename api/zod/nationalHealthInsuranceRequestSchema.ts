import { z } from "zod";


export const nationalHealthInsuranceRequestSchema = z.object({ "insuranceNumber": z.string().optional(), "placeOfRegistration": z.string().optional() });