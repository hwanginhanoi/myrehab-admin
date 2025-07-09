import type { CourseDto } from "./CourseDto";

 export type GetCoursesByCategoryPathParams = {
    /**
     * @type integer, int64
    */
    categoryId: number;
};
/**
 * @description OK
*/
export type GetCoursesByCategory200 = CourseDto[];
/**
 * @description OK
*/
export type GetCoursesByCategoryQueryResponse = CourseDto[];
export type GetCoursesByCategoryQuery = {
    Response: GetCoursesByCategoryQueryResponse;
    PathParams: GetCoursesByCategoryPathParams;
};