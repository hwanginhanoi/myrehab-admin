import type { ExerciseCategoryResponse } from "./ExerciseCategoryResponse";

 export type GetCategoryByIdPathParams = {
    /**
     * @type integer, int64
    */
    id: number;
};
/**
 * @description OK
*/
export type GetCategoryById200 = ExerciseCategoryResponse;
/**
 * @description OK
*/
export type GetCategoryByIdQueryResponse = ExerciseCategoryResponse;
export type GetCategoryByIdQuery = {
    Response: GetCategoryByIdQueryResponse;
    PathParams: GetCategoryByIdPathParams;
};