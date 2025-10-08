import type { PageCourseCategoryResponse } from "./PageCourseCategoryResponse";

 export type GetAllCategoriesPaginated1QueryParams = {
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
export type GetAllCategoriesPaginated1200 = PageCourseCategoryResponse;
/**
 * @description OK
*/
export type GetAllCategoriesPaginated1QueryResponse = PageCourseCategoryResponse;
export type GetAllCategoriesPaginated1Query = {
    Response: GetAllCategoriesPaginated1QueryResponse;
    QueryParams: GetAllCategoriesPaginated1QueryParams;
};