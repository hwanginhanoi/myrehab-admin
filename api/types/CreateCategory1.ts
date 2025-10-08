import type { CourseCategoryResponse } from "./CourseCategoryResponse";
import type { CreateCourseCategoryRequest } from "./CreateCourseCategoryRequest";

 /**
 * @description OK
*/
export type CreateCategory1200 = CourseCategoryResponse;
export type CreateCategory1MutationRequest = CreateCourseCategoryRequest;
/**
 * @description OK
*/
export type CreateCategory1MutationResponse = CourseCategoryResponse;
export type CreateCategory1Mutation = {
    Response: CreateCategory1MutationResponse;
    Request: CreateCategory1MutationRequest;
};