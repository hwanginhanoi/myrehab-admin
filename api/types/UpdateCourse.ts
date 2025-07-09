import type { CourseDto } from "./CourseDto";

 export type UpdateCoursePathParams = {
    /**
     * @type integer, int64
    */
    id: number;
};
/**
 * @description OK
*/
export type UpdateCourse200 = CourseDto;
export type UpdateCourseMutationRequest = CourseDto;
/**
 * @description OK
*/
export type UpdateCourseMutationResponse = CourseDto;
export type UpdateCourseMutation = {
    Response: UpdateCourseMutationResponse;
    Request: UpdateCourseMutationRequest;
    PathParams: UpdateCoursePathParams;
};