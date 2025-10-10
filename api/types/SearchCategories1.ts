import type { CourseCategoryResponse } from "./CourseCategoryResponse";

 export type SearchCategories1QueryParams = {
    /**
     * @type string
    */
    keyword: string;
};
/**
 * @description OK
*/
export type SearchCategories1200 = CourseCategoryResponse[];
/**
 * @description OK
*/
export type SearchCategories1QueryResponse = CourseCategoryResponse[];
export type SearchCategories1Query = {
    Response: SearchCategories1QueryResponse;
    QueryParams: SearchCategories1QueryParams;
};