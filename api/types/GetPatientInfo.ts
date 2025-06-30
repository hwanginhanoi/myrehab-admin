import type { PatientInfoResponse } from "./PatientInfoResponse";

 export type GetPatientInfoPathParams = {
    /**
     * @type integer, int64
    */
    id: number;
};
/**
 * @description OK
*/
export type GetPatientInfo200 = PatientInfoResponse;
/**
 * @description OK
*/
export type GetPatientInfoQueryResponse = PatientInfoResponse;
export type GetPatientInfoQuery = {
    Response: GetPatientInfoQueryResponse;
    PathParams: GetPatientInfoPathParams;
};