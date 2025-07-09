import { z } from "zod";
import { categoryDtoSchema } from "./categoryDtoSchema";


export const getCategoriesByTypePathParamsSchema = z.object({ "type": z.enum(["BODY_PART", "RECOVERY_STAGE", "HEALTH_CONDITION"]) });
/**
 * @description OK
 */
export const getCategoriesByType200Schema = z.array(z.lazy(() => categoryDtoSchema));
/**
 * @description OK
 */
export const getCategoriesByTypeQueryResponseSchema = z.array(z.lazy(() => categoryDtoSchema));