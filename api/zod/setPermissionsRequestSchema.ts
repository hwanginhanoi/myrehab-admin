import { z } from "zod";


export const setPermissionsRequestSchema = z.object({ "permissions": z.array(z.string()).optional() });