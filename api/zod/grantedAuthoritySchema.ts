import { z } from "zod";


export const grantedAuthoritySchema = z.object({ "authority": z.string().optional() });