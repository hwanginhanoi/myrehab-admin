import { z } from "zod";


export const purchaseResponseSchema = z.object({ "id": z.number().int().optional(), "type": z.string().optional(), "courseId": z.number().int().optional(), "courseTitle": z.string().optional(), "exerciseId": z.number().int().optional(), "exerciseTitle": z.string().optional(), "price": z.number().optional(), "purchasedAt": z.string().datetime().optional() });