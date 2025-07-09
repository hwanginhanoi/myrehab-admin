import type { CategoryDto } from "./CategoryDto";

 /**
 * @description OK
*/
export type CreateCategory200 = CategoryDto;
export type CreateCategoryMutationRequest = CategoryDto;
/**
 * @description OK
*/
export type CreateCategoryMutationResponse = CategoryDto;
export type CreateCategoryMutation = {
    Response: CreateCategoryMutationResponse;
    Request: CreateCategoryMutationRequest;
};