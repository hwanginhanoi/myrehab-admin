import { z } from "zod";


export const deleteCategoryPathParamsSchema = z.object({ "id": z.number().int() });
/**
 * @description OK
 */
export const deleteCategory200Schema = z.any();

 export const deleteCategoryMutationResponseSchema = z.any();