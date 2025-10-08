import { z } from "zod";


export const userProfileResponseSchema = z.object({ "id": z.number().int().optional(), "userId": z.number().int().optional(), "vietnameseIdentityCard": z.string().optional(), "jobTitle": z.string().optional(), "address": z.string().optional(), "nationality": z.string().optional(), "ethnic": z.string().optional(), "createdAt": z.string().datetime().optional(), "updatedAt": z.string().datetime().optional() });