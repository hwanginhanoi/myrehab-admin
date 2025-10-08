import { z } from "zod";


export const deleteUserProfilePathParamsSchema = z.object({ "userId": z.number().int() });
/**
 * @description OK
 */
export const deleteUserProfile200Schema = z.any();

 export const deleteUserProfileMutationResponseSchema = z.any();