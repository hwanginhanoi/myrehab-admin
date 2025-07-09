import type { CourseDto } from "./CourseDto";

 export type GetAssignedCoursesPathParams = {
    /**
     * @type integer, int64
    */
    patientId: number;
};
/**
 * @description OK
*/
export type GetAssignedCourses200 = CourseDto[];
/**
 * @description OK
*/
export type GetAssignedCoursesQueryResponse = CourseDto[];
export type GetAssignedCoursesQuery = {
    Response: GetAssignedCoursesQueryResponse;
    PathParams: GetAssignedCoursesPathParams;
};