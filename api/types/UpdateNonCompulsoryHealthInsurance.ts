import type { NonCompulsoryHealthInsuranceResponse } from "./NonCompulsoryHealthInsuranceResponse";
import type { NonCompulsoryHealthInsuranceRequest } from "./NonCompulsoryHealthInsuranceRequest";

 export type UpdateNonCompulsoryHealthInsurancePathParams = {
    /**
     * @type integer, int64
    */
    userId: number;
};
/**
 * @description OK
*/
export type UpdateNonCompulsoryHealthInsurance200 = NonCompulsoryHealthInsuranceResponse;
export type UpdateNonCompulsoryHealthInsuranceMutationRequest = NonCompulsoryHealthInsuranceRequest;
/**
 * @description OK
*/
export type UpdateNonCompulsoryHealthInsuranceMutationResponse = NonCompulsoryHealthInsuranceResponse;
export type UpdateNonCompulsoryHealthInsuranceMutation = {
    Response: UpdateNonCompulsoryHealthInsuranceMutationResponse;
    Request: UpdateNonCompulsoryHealthInsuranceMutationRequest;
    PathParams: UpdateNonCompulsoryHealthInsurancePathParams;
};