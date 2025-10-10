import { z } from "zod";
import { assignPermissionRequestSchema } from "./assignPermissionRequestSchema";


export const assignPermissionToAdminPathParamsSchema = z.object({ "adminId": z.number().int() });
/**
 * @description OK
 */
export const assignPermissionToAdmin200Schema = z.any();

 export const assignPermissionToAdminMutationRequestSchema = z.lazy(() => assignPermissionRequestSchema);

 export const assignPermissionToAdminMutationResponseSchema = z.any();