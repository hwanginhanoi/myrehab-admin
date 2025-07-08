import type { Course } from "./Course";

 export type GetCoursesByCategoryIdPathParams = {
    /**
     * @type integer, int64
    */
    categoryId: number;
};
/**
 * @description OK
*/
export type GetCoursesByCategoryId200 = Course[];
/**
 * @description OK
*/
export type GetCoursesByCategoryIdQueryResponse = Course[];
export type GetCoursesByCategoryIdQuery = {
    Response: GetCoursesByCategoryIdQueryResponse;
    PathParams: GetCoursesByCategoryIdPathParams;
};