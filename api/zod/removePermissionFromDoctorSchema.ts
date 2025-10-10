import { z } from "zod";
import { assignPermissionRequestSchema } from "./assignPermissionRequestSchema";


export const removePermissionFromDoctorPathParamsSchema = z.object({ "doctorId": z.number().int() });
/**
 * @description OK
 */
export const removePermissionFromDoctor200Schema = z.any();

 export const removePermissionFromDoctorMutationRequestSchema = z.lazy(() => assignPermissionRequestSchema);

 export const removePermissionFromDoctorMutationResponseSchema = z.any();