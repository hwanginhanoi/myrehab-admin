import { z } from "zod";
import { planListResponseSchema } from "./planListResponseSchema";


export const getPlansByCategoryPathParamsSchema = z.object({ "category": z.enum(["BACK_PAIN", "NECK_PAIN", "SHOULDER_PAIN", "KNEE_PAIN", "HIP_PAIN", "WRIST_PAIN", "CHRONIC_PAIN", "ARTHRITIS", "SCIATICA", "GENERAL"]) });
/**
 * @description OK
 */
export const getPlansByCategory200Schema = z.array(z.lazy(() => planListResponseSchema));
/**
 * @description OK
 */
export const getPlansByCategoryQueryResponseSchema = z.array(z.lazy(() => planListResponseSchema));