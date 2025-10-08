import type { ExerciseCategoryResponse } from "./ExerciseCategoryResponse";

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
export type SearchCategories200 = ExerciseCategoryResponse[];
/**
 * @description OK
*/
export type SearchCategoriesQueryResponse = ExerciseCategoryResponse[];
export type SearchCategoriesQuery = {
    Response: SearchCategoriesQueryResponse;
    QueryParams: SearchCategoriesQueryParams;
};