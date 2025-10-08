import type { CourseCategoryResponse } from "./CourseCategoryResponse";

 export type GetCategoryById1PathParams = {
    /**
     * @type integer, int64
    */
    id: number;
};
/**
 * @description OK
*/
export type GetCategoryById1200 = CourseCategoryResponse;
/**
 * @description OK
*/
export type GetCategoryById1QueryResponse = CourseCategoryResponse;
export type GetCategoryById1Query = {
    Response: GetCategoryById1QueryResponse;
    PathParams: GetCategoryById1PathParams;
};