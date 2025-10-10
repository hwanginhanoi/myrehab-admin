import type { Pageable } from "./Pageable";
import type { PageExerciseCategoryResponse } from "./PageExerciseCategoryResponse";

 export type SearchCategoriesPaginatedQueryParams = {
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
export type SearchCategoriesPaginated200 = PageExerciseCategoryResponse;
/**
 * @description OK
*/
export type SearchCategoriesPaginatedQueryResponse = PageExerciseCategoryResponse;
export type SearchCategoriesPaginatedQuery = {
    Response: SearchCategoriesPaginatedQueryResponse;
    QueryParams: SearchCategoriesPaginatedQueryParams;
};