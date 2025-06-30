import type { PlanDetailResponse } from "./PlanDetailResponse";
import type { PlanCreateRequest } from "./PlanCreateRequest";

 /**
 * @description OK
*/
export type CreatePlan200 = PlanDetailResponse;
export type CreatePlanMutationRequest = PlanCreateRequest;
/**
 * @description OK
*/
export type CreatePlanMutationResponse = PlanDetailResponse;
export type CreatePlanMutation = {
    Response: CreatePlanMutationResponse;
    Request: CreatePlanMutationRequest;
};