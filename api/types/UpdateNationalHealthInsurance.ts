import type { NationalHealthInsuranceResponse } from "./NationalHealthInsuranceResponse";
import type { NationalHealthInsuranceRequest } from "./NationalHealthInsuranceRequest";

 export type UpdateNationalHealthInsurancePathParams = {
    /**
     * @type integer, int64
    */
    userId: number;
};
/**
 * @description OK
*/
export type UpdateNationalHealthInsurance200 = NationalHealthInsuranceResponse;
export type UpdateNationalHealthInsuranceMutationRequest = NationalHealthInsuranceRequest;
/**
 * @description OK
*/
export type UpdateNationalHealthInsuranceMutationResponse = NationalHealthInsuranceResponse;
export type UpdateNationalHealthInsuranceMutation = {
    Response: UpdateNationalHealthInsuranceMutationResponse;
    Request: UpdateNationalHealthInsuranceMutationRequest;
    PathParams: UpdateNationalHealthInsurancePathParams;
};