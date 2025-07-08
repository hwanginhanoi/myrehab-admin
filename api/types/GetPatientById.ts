import type { PatientDto } from "./PatientDto";

 export type GetPatientByIdPathParams = {
    /**
     * @type integer, int64
    */
    id: number;
};
/**
 * @description OK
*/
export type GetPatientById200 = PatientDto;
/**
 * @description OK
*/
export type GetPatientByIdQueryResponse = PatientDto;
export type GetPatientByIdQuery = {
    Response: GetPatientByIdQueryResponse;
    PathParams: GetPatientByIdPathParams;
};