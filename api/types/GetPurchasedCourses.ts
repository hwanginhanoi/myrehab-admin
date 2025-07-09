import type { CourseDto } from "./CourseDto";

 export type GetPurchasedCoursesPathParams = {
    /**
     * @type integer, int64
    */
    patientId: number;
};
/**
 * @description OK
*/
export type GetPurchasedCourses200 = CourseDto[];
/**
 * @description OK
*/
export type GetPurchasedCoursesQueryResponse = CourseDto[];
export type GetPurchasedCoursesQuery = {
    Response: GetPurchasedCoursesQueryResponse;
    PathParams: GetPurchasedCoursesPathParams;
};