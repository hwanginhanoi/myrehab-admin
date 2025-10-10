import type { Pageable } from "./Pageable";
import type { PageCourseCategoryResponse } from "./PageCourseCategoryResponse";

 export type GetAllCategoriesPaginated1QueryParams = {
    /**
     * @type object
    */
    pageable: Pageable;
};
/**
 * @description OK
*/
export type GetAllCategoriesPaginated1200 = PageCourseCategoryResponse;
/**
 * @description OK
*/
export type GetAllCategoriesPaginated1QueryResponse = PageCourseCategoryResponse;
export type GetAllCategoriesPaginated1Query = {
    Response: GetAllCategoriesPaginated1QueryResponse;
    QueryParams: GetAllCategoriesPaginated1QueryParams;
};