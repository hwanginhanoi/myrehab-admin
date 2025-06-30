import { z } from "zod";
import { planListResponseSchema } from "./planListResponseSchema";

 /**
 * @description OK
 */
export const getAllPlans1200Schema = z.array(z.lazy(() => planListResponseSchema));
/**
 * @description OK
 */
export const getAllPlans1QueryResponseSchema = z.array(z.lazy(() => planListResponseSchema));