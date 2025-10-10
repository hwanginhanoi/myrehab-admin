import { z } from "zod";


export const assignPermissionRequestSchema = z.object({ "permissionName": z.string().optional() });