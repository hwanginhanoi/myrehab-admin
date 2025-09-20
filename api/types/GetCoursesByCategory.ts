import type { CourseResponse } from "./CourseResponse";

 export type GetCoursesByCategoryPathParams = {
    /**
     * @type integer, int64
    */
    categoryId: number;
};
/**
 * @description OK
*/
export type GetCoursesByCategory200 = CourseResponse[];
/**
 * @description OK
*/
export type GetCoursesByCategoryQueryResponse = CourseResponse[];
export type GetCoursesByCategoryQuery = {
    Response: GetCoursesByCategoryQueryResponse;
    PathParams: GetCoursesByCategoryPathParams;
};