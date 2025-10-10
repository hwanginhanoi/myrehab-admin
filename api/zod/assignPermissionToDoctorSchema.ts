import { z } from "zod";
import { assignPermissionRequestSchema } from "./assignPermissionRequestSchema";


export const assignPermissionToDoctorPathParamsSchema = z.object({ "doctorId": z.number().int() });
/**
 * @description OK
 */
export const assignPermissionToDoctor200Schema = z.any();

 export const assignPermissionToDoctorMutationRequestSchema = z.lazy(() => assignPermissionRequestSchema);

 export const assignPermissionToDoctorMutationResponseSchema = z.any();