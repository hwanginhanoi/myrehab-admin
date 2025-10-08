import type { ExerciseCategoryResponse } from "./ExerciseCategoryResponse";
import type { CreateExerciseCategoryRequest } from "./CreateExerciseCategoryRequest";

 /**
 * @description OK
*/
export type CreateCategory200 = ExerciseCategoryResponse;
export type CreateCategoryMutationRequest = CreateExerciseCategoryRequest;
/**
 * @description OK
*/
export type CreateCategoryMutationResponse = ExerciseCategoryResponse;
export type CreateCategoryMutation = {
    Response: CreateCategoryMutationResponse;
    Request: CreateCategoryMutationRequest;
};