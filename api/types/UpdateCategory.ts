import type { CategoryResponse } from "./CategoryResponse";
import type { UpdateCategoryRequest } from "./UpdateCategoryRequest";

 export type UpdateCategoryPathParams = {
    /**
     * @type integer, int64
    */
    id: number;
};
/**
 * @description OK
*/
export type UpdateCategory200 = CategoryResponse;
export type UpdateCategoryMutationRequest = UpdateCategoryRequest;
/**
 * @description OK
*/
export type UpdateCategoryMutationResponse = CategoryResponse;
export type UpdateCategoryMutation = {
    Response: UpdateCategoryMutationResponse;
    Request: UpdateCategoryMutationRequest;
    PathParams: UpdateCategoryPathParams;
};