import type { PlanDetailResponse } from "./PlanDetailResponse";

 export type GetPlanById1PathParams = {
    /**
     * @type integer, int64
    */
    id: number;
};
/**
 * @description OK
*/
export type GetPlanById1200 = PlanDetailResponse;
/**
 * @description OK
*/
export type GetPlanById1QueryResponse = PlanDetailResponse;
export type GetPlanById1Query = {
    Response: GetPlanById1QueryResponse;
    PathParams: GetPlanById1PathParams;
};