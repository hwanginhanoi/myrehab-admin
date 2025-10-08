import { z } from "zod";


export const userProfileRequestSchema = z.object({ "vietnameseIdentityCard": z.string().optional(), "jobTitle": z.string().optional(), "address": z.string().optional(), "nationality": z.string().optional(), "ethnic": z.string().optional() });