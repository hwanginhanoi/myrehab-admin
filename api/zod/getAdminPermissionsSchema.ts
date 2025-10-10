import { z } from "zod";


export const getAdminPermissionsPathParamsSchema = z.object({ "adminId": z.number().int() });
/**
 * @description OK
 */
export const getAdminPermissions200Schema = z.array(z.string());
/**
 * @description OK
 */
export const getAdminPermissionsQueryResponseSchema = z.array(z.string());