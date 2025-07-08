import { z } from "zod";


export const authRequestSchema = z.object({ "email": z.string().optional(), "password": z.string().optional() });