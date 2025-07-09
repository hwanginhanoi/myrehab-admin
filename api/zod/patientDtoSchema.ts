import { z } from "zod";


export const patientDtoSchema = z.object({ "id": z.number().int().optional(), "email": z.string().optional(), "firstName": z.string().optional(), "lastName": z.string().optional(), "enabled": z.boolean().optional() });