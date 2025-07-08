import type { PatientDto } from "./PatientDto";

 export type AssignCourseToPatientPathParams = {
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
export type AssignCourseToPatient200 = PatientDto;
/**
 * @description OK
*/
export type AssignCourseToPatientMutationResponse = PatientDto;
export type AssignCourseToPatientMutation = {
    Response: AssignCourseToPatientMutationResponse;
    PathParams: AssignCourseToPatientPathParams;
};