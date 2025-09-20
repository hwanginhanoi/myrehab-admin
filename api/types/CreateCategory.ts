import type { CategoryResponse } from "./CategoryResponse";
import type { CreateCategoryRequest } from "./CreateCategoryRequest";

 /**
 * @description OK
*/
export type CreateCategory200 = CategoryResponse;
export type CreateCategoryMutationRequest = CreateCategoryRequest;
/**
 * @description OK
*/
export type CreateCategoryMutationResponse = CategoryResponse;
export type CreateCategoryMutation = {
    Response: CreateCategoryMutationResponse;
    Request: CreateCategoryMutationRequest;
};