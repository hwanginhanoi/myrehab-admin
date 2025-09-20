import type { CourseResponse } from "./CourseResponse";

 export type GetCourseByIdPathParams = {
    /**
     * @type integer, int64
    */
    id: number;
};
/**
 * @description OK
*/
export type GetCourseById200 = CourseResponse;
/**
 * @description OK
*/
export type GetCourseByIdQueryResponse = CourseResponse;
export type GetCourseByIdQuery = {
    Response: GetCourseByIdQueryResponse;
    PathParams: GetCourseByIdPathParams;
};