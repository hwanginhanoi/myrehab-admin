import { z } from "zod";


export const getDoctorPermissionsPathParamsSchema = z.object({ "doctorId": z.number().int() });
/**
 * @description OK
 */
export const getDoctorPermissions200Schema = z.array(z.string());
/**
 * @description OK
 */
export const getDoctorPermissionsQueryResponseSchema = z.array(z.string());