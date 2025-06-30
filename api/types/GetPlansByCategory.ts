import type { PlanListResponse } from "./PlanListResponse";

 export const getPlansByCategoryPathParamsCategory = {
    "BACK_PAIN": "BACK_PAIN",
    "NECK_PAIN": "NECK_PAIN",
    "SHOULDER_PAIN": "SHOULDER_PAIN",
    "KNEE_PAIN": "KNEE_PAIN",
    "HIP_PAIN": "HIP_PAIN",
    "WRIST_PAIN": "WRIST_PAIN",
    "CHRONIC_PAIN": "CHRONIC_PAIN",
    "ARTHRITIS": "ARTHRITIS",
    "SCIATICA": "SCIATICA",
    "GENERAL": "GENERAL"
} as const;
export type GetPlansByCategoryPathParamsCategory = (typeof getPlansByCategoryPathParamsCategory)[keyof typeof getPlansByCategoryPathParamsCategory];
export type GetPlansByCategoryPathParams = {
    /**
     * @type string
    */
    category: GetPlansByCategoryPathParamsCategory;
};
/**
 * @description OK
*/
export type GetPlansByCategory200 = PlanListResponse[];
/**
 * @description OK
*/
export type GetPlansByCategoryQueryResponse = PlanListResponse[];
export type GetPlansByCategoryQuery = {
    Response: GetPlansByCategoryQueryResponse;
    PathParams: GetPlansByCategoryPathParams;
};