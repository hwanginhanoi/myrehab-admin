import { z } from "zod";
import { planListResponseSchema } from "./planListResponseSchema";

 /**
 * @description OK
 */
export const getAllPlans200Schema = z.array(z.lazy(() => planListResponseSchema));
/**
 * @description OK
 */
export const getAllPlansQueryResponseSchema = z.array(z.lazy(() => planListResponseSchema));