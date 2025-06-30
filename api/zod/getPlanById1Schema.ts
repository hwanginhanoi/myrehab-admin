import { z } from "zod";
import { planDetailResponseSchema } from "./planDetailResponseSchema";


export const getPlanById1PathParamsSchema = z.object({ "id": z.number().int() });
/**
 * @description OK
 */
export const getPlanById1200Schema = z.lazy(() => planDetailResponseSchema);
/**
 * @description OK
 */
export const getPlanById1QueryResponseSchema = z.lazy(() => planDetailResponseSchema);