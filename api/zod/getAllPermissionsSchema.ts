import { z } from "zod";

 /**
 * @description OK
 */
export const getAllPermissions200Schema = z.array(z.string());
/**
 * @description OK
 */
export const getAllPermissionsQueryResponseSchema = z.array(z.string());