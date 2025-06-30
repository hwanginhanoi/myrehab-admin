import type { PlanDetailResponse } from "./PlanDetailResponse";

 export type GetPlanByIdPathParams = {
    /**
     * @type integer, int64
    */
    id: number;
};
/**
 * @description OK
*/
export type GetPlanById200 = PlanDetailResponse;
/**
 * @description OK
*/
export type GetPlanByIdQueryResponse = PlanDetailResponse;
export type GetPlanByIdQuery = {
    Response: GetPlanByIdQueryResponse;
    PathParams: GetPlanByIdPathParams;
};