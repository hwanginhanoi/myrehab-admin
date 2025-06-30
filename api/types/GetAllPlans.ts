import type { PlanListResponse } from "./PlanListResponse";

 /**
 * @description OK
*/
export type GetAllPlans200 = PlanListResponse[];
/**
 * @description OK
*/
export type GetAllPlansQueryResponse = PlanListResponse[];
export type GetAllPlansQuery = {
    Response: GetAllPlansQueryResponse;
};