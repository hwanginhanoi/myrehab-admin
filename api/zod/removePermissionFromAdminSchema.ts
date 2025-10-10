import { z } from "zod";
import { assignPermissionRequestSchema } from "./assignPermissionRequestSchema";


export const removePermissionFromAdminPathParamsSchema = z.object({ "adminId": z.number().int() });
/**
 * @description OK
 */
export const removePermissionFromAdmin200Schema = z.any();

 export const removePermissionFromAdminMutationRequestSchema = z.lazy(() => assignPermissionRequestSchema);

 export const removePermissionFromAdminMutationResponseSchema = z.any();