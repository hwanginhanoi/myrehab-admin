import type { CourseDto } from "./CourseDto";

 export type GetCourseByIdPathParams = {
    /**
     * @type integer, int64
    */
    id: number;
};
/**
 * @description OK
*/
export type GetCourseById200 = CourseDto;
/**
 * @description OK
*/
export type GetCourseByIdQueryResponse = CourseDto;
export type GetCourseByIdQuery = {
    Response: GetCourseByIdQueryResponse;
    PathParams: GetCourseByIdPathParams;
};