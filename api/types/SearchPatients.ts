import type { PatientDto } from "./PatientDto";

 export type SearchPatientsQueryParams = {
    /**
     * @type string
    */
    query: string;
};
/**
 * @description OK
*/
export type SearchPatients200 = PatientDto[];
/**
 * @description OK
*/
export type SearchPatientsQueryResponse = PatientDto[];
export type SearchPatientsQuery = {
    Response: SearchPatientsQueryResponse;
    QueryParams: SearchPatientsQueryParams;
};