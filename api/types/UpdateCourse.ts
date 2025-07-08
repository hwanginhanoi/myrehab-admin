import type { Course } from "./Course";

 export type UpdateCoursePathParams = {
    /**
     * @type integer, int64
    */
    id: number;
};
/**
 * @description OK
*/
export type UpdateCourse200 = Course;
export type UpdateCourseMutationRequest = Course;
/**
 * @description OK
*/
export type UpdateCourseMutationResponse = Course;
export type UpdateCourseMutation = {
    Response: UpdateCourseMutationResponse;
    Request: UpdateCourseMutationRequest;
    PathParams: UpdateCoursePathParams;
};