import type { PageExerciseCategoryResponse } from "./PageExerciseCategoryResponse";

 export type SearchCategoriesPaginatedQueryParams = {
    /**
     * @description Search keyword
     * @type string
    */
    keyword: string;
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
export type SearchCategoriesPaginated200 = PageExerciseCategoryResponse;
/**
 * @description OK
*/
export type SearchCategoriesPaginatedQueryResponse = PageExerciseCategoryResponse;
export type SearchCategoriesPaginatedQuery = {
    Response: SearchCategoriesPaginatedQueryResponse;
    QueryParams: SearchCategoriesPaginatedQueryParams;
};