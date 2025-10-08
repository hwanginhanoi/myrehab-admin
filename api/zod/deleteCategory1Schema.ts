import { z } from "zod";


export const deleteCategory1PathParamsSchema = z.object({ "id": z.number().int() });
/**
 * @description OK
 */
export const deleteCategory1200Schema = z.any();

 export const deleteCategory1MutationResponseSchema = z.any();