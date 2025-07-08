import type { PatientDto } from "./PatientDto";

 export type RemoveCourseFromPatientPathParams = {
    /**
     * @type integer, int64
    */
    patientId: number;
    /**
     * @type integer, int64
    */
    courseId: number;
};
/**
 * @description OK
*/
export type RemoveCourseFromPatient200 = PatientDto;
/**
 * @description OK
*/
export type RemoveCourseFromPatientMutationResponse = PatientDto;
export type RemoveCourseFromPatientMutation = {
    Response: RemoveCourseFromPatientMutationResponse;
    PathParams: RemoveCourseFromPatientPathParams;
};