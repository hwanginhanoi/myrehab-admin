import type { Course } from "./Course";

 export type GetCourseByIdPathParams = {
    /**
     * @type integer, int64
    */
    id: number;
};
/**
 * @description OK
*/
export type GetCourseById200 = Course;
/**
 * @description OK
*/
export type GetCourseByIdQueryResponse = Course;
export type GetCourseByIdQuery = {
    Response: GetCourseByIdQueryResponse;
    PathParams: GetCourseByIdPathParams;
};