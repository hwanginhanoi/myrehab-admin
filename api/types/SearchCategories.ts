import type { CategoryResponse } from "./CategoryResponse";

 export type SearchCategoriesQueryParams = {
    /**
     * @description Search keyword
     * @type string
    */
    keyword: string;
};
/**
 * @description OK
*/
export type SearchCategories200 = CategoryResponse[];
/**
 * @description OK
*/
export type SearchCategoriesQueryResponse = CategoryResponse[];
export type SearchCategoriesQuery = {
    Response: SearchCategoriesQueryResponse;
    QueryParams: SearchCategoriesQueryParams;
};