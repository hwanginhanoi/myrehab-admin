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
export type AssignCourseToPatient200 = any;
export type AssignCourseToPatientMutationResponse = any;
export type AssignCourseToPatientMutation = {
    Response: AssignCourseToPatientMutationResponse;
    PathParams: AssignCourseToPatientPathParams;
};