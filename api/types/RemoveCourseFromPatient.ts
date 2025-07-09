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
export type RemoveCourseFromPatient200 = any;
export type RemoveCourseFromPatientMutationResponse = any;
export type RemoveCourseFromPatientMutation = {
    Response: RemoveCourseFromPatientMutationResponse;
    PathParams: RemoveCourseFromPatientPathParams;
};