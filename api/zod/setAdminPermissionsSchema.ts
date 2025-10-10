import { z } from "zod";
import { setPermissionsRequestSchema } from "./setPermissionsRequestSchema";


export const setAdminPermissionsPathParamsSchema = z.object({ "adminId": z.number().int() });
/**
 * @description OK
 */
export const setAdminPermissions200Schema = z.any();

 export const setAdminPermissionsMutationRequestSchema = z.lazy(() => setPermissionsRequestSchema);

 export const setAdminPermissionsMutationResponseSchema = z.any();