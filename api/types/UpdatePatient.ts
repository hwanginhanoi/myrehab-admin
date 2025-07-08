import type { PatientDto } from "./PatientDto";

 export type UpdatePatientPathParams = {
    /**
     * @type integer, int64
    */
    id: number;
};
/**
 * @description OK
*/
export type UpdatePatient200 = PatientDto;
export type UpdatePatientMutationRequest = PatientDto;
/**
 * @description OK
*/
export type UpdatePatientMutationResponse = PatientDto;
export type UpdatePatientMutation = {
    Response: UpdatePatientMutationResponse;
    Request: UpdatePatientMutationRequest;
    PathParams: UpdatePatientPathParams;
};