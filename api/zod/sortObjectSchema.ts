import { z } from "zod";


export const sortObjectSchema = z.object({ "empty": z.boolean().optional(), "sorted": z.boolean().optional(), "unsorted": z.boolean().optional() });