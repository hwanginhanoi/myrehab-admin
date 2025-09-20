import type { CategoryResponse } from "./CategoryResponse";

 export type GetCategoryByIdPathParams = {
    /**
     * @type integer, int64
    */
    id: number;
};
/**
 * @description OK
*/
export type GetCategoryById200 = CategoryResponse;
/**
 * @description OK
*/
export type GetCategoryByIdQueryResponse = CategoryResponse;
export type GetCategoryByIdQuery = {
    Response: GetCategoryByIdQueryResponse;
    PathParams: GetCategoryByIdPathParams;
};