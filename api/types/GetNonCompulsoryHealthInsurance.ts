import type { NonCompulsoryHealthInsuranceResponse } from "./NonCompulsoryHealthInsuranceResponse";

 export type GetNonCompulsoryHealthInsurancePathParams = {
    /**
     * @type integer, int64
    */
    userId: number;
};
/**
 * @description OK
*/
export type GetNonCompulsoryHealthInsurance200 = NonCompulsoryHealthInsuranceResponse;
/**
 * @description OK
*/
export type GetNonCompulsoryHealthInsuranceQueryResponse = NonCompulsoryHealthInsuranceResponse;
export type GetNonCompulsoryHealthInsuranceQuery = {
    Response: GetNonCompulsoryHealthInsuranceQueryResponse;
    PathParams: GetNonCompulsoryHealthInsurancePathParams;
};