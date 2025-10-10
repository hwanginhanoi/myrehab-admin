import type { Pageable } from "./Pageable";
import type { PageCourseCategoryResponse } from "./PageCourseCategoryResponse";

 export type SearchCategoriesPaginated1QueryParams = {
    /**
     * @type string
    */
    keyword: string;
    /**
     * @type object
    */
    pageable: Pageable;
};
/**
 * @description OK
*/
export type SearchCategoriesPaginated1200 = PageCourseCategoryResponse;
/**
 * @description OK
*/
export type SearchCategoriesPaginated1QueryResponse = PageCourseCategoryResponse;
export type SearchCategoriesPaginated1Query = {
    Response: SearchCategoriesPaginated1QueryResponse;
    QueryParams: SearchCategoriesPaginated1QueryParams;
};