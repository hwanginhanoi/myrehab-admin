import { z } from "zod";


export const exerciseCategoryResponseSchema = z.object({ "id": z.number().int().optional(), "name": z.string().optional(), "description": z.string().optional(), "type": z.string().optional(), "createdAt": z.string().datetime().optional(), "updatedAt": z.string().datetime().optional() });