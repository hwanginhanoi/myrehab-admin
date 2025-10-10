import type { ExerciseCategoryResponse } from "./ExerciseCategoryResponse";

 export type SearchCategoriesQueryParams = {
    /**
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