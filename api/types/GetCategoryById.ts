import type { CategoryDto } from "./CategoryDto";

 export type GetCategoryByIdPathParams = {
    /**
     * @type integer, int64
    */
    id: number;
};
/**
 * @description OK
*/
export type GetCategoryById200 = CategoryDto;
/**
 * @description OK
*/
export type GetCategoryByIdQueryResponse = CategoryDto;
export type GetCategoryByIdQuery = {
    Response: GetCategoryByIdQueryResponse;
    PathParams: GetCategoryByIdPathParams;
};