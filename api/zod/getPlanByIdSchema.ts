import { z } from "zod";
import { planDetailResponseSchema } from "./planDetailResponseSchema";


export const getPlanByIdPathParamsSchema = z.object({ "id": z.number().int() });
/**
 * @description OK
 */
export const getPlanById200Schema = z.lazy(() => planDetailResponseSchema);
/**
 * @description OK
 */
export const getPlanByIdQueryResponseSchema = z.lazy(() => planDetailResponseSchema);