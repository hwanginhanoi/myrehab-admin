import { z } from "zod";
import { setPermissionsRequestSchema } from "./setPermissionsRequestSchema";


export const setDoctorPermissionsPathParamsSchema = z.object({ "doctorId": z.number().int() });
/**
 * @description OK
 */
export const setDoctorPermissions200Schema = z.any();

 export const setDoctorPermissionsMutationRequestSchema = z.lazy(() => setPermissionsRequestSchema);

 export const setDoctorPermissionsMutationResponseSchema = z.any();