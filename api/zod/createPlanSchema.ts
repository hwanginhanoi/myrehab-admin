import { z } from "zod";
import { planDetailResponseSchema } from "./planDetailResponseSchema";
import { planCreateRequestSchema } from "./planCreateRequestSchema";

 /**
 * @description OK
 */
export const createPlan200Schema = z.lazy(() => planDetailResponseSchema);

 export const createPlanMutationRequestSchema = z.lazy(() => planCreateRequestSchema);
/**
 * @description OK
 */
export const createPlanMutationResponseSchema = z.lazy(() => planDetailResponseSchema);