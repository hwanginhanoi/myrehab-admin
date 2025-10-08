import type { NationalHealthInsuranceResponse } from "./NationalHealthInsuranceResponse";

 export type GetNationalHealthInsurancePathParams = {
    /**
     * @type integer, int64
    */
    userId: number;
};
/**
 * @description OK
*/
export type GetNationalHealthInsurance200 = NationalHealthInsuranceResponse;
/**
 * @description OK
*/
export type GetNationalHealthInsuranceQueryResponse = NationalHealthInsuranceResponse;
export type GetNationalHealthInsuranceQuery = {
    Response: GetNationalHealthInsuranceQueryResponse;
    PathParams: GetNationalHealthInsurancePathParams;
};