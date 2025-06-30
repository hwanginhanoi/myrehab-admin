import type { PlanListResponse } from "./PlanListResponse";

 /**
 * @description OK
*/
export type GetAllPlans1200 = PlanListResponse[];
/**
 * @description OK
*/
export type GetAllPlans1QueryResponse = PlanListResponse[];
export type GetAllPlans1Query = {
    Response: GetAllPlans1QueryResponse;
};