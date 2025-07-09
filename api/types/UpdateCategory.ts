import type { CategoryDto } from "./CategoryDto";

 export type UpdateCategoryPathParams = {
    /**
     * @type integer, int64
    */
    id: number;
};
/**
 * @description OK
*/
export type UpdateCategory200 = CategoryDto;
export type UpdateCategoryMutationRequest = CategoryDto;
/**
 * @description OK
*/
export type UpdateCategoryMutationResponse = CategoryDto;
export type UpdateCategoryMutation = {
    Response: UpdateCategoryMutationResponse;
    Request: UpdateCategoryMutationRequest;
    PathParams: UpdateCategoryPathParams;
};