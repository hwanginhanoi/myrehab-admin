import type { PageExerciseCategoryResponse } from "./PageExerciseCategoryResponse";

 export type GetAllCategoriesPaginatedQueryParams = {
    /**
     * @description Page number (0-based)
     * @default 0
     * @type integer | undefined, int32
    */
    page?: number;
    /**
     * @description Number of items per page
     * @default 10
     * @type integer | undefined, int32
    */
    size?: number;
    /**
     * @description Sort by field
     * @default "name"
     * @type string | undefined
    */
    sortBy?: string;
    /**
     * @description Sort direction
     * @default "asc"
     * @type string | undefined
    */
    sortDir?: string;
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