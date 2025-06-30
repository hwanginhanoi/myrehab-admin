import { z } from "zod";


export const patientInfoResponseSchema = z.object({ "id": z.number().int(), "email": z.string(), "firstName": z.string(), "lastName": z.string(), "phoneNumber": z.string().optional(), "medicalHistory": z.string().optional(), "dateOfBirth": z.string().optional(), "gender": z.string().optional() });