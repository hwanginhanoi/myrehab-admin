import type { Pageable } from "./Pageable";
import type { PageExerciseCategoryResponse } from "./PageExerciseCategoryResponse";

 export type GetAllCategoriesPaginatedQueryParams = {
    /**
     * @type object
    */
    pageable: Pageable;
};
/**
 * @description OK
*/
export type GetAllCategoriesPaginated200 = PageExerciseCategoryResponse;
/**
 * @description OK
*/
export type GetAllCategoriesPaginatedQueryResponse = PageExerciseCategoryResponse;
export type GetAllCategoriesPaginatedQuery = {
    Response: GetAllCategoriesPaginatedQueryResponse;
    QueryParams: GetAllCategoriesPaginatedQueryParams;
};