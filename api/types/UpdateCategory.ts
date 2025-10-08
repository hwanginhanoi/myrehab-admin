import type { ExerciseCategoryResponse } from "./ExerciseCategoryResponse";
import type { UpdateExerciseCategoryRequest } from "./UpdateExerciseCategoryRequest";

 export type UpdateCategoryPathParams = {
    /**
     * @type integer, int64
    */
    id: number;
};
/**
 * @description OK
*/
export type UpdateCategory200 = ExerciseCategoryResponse;
export type UpdateCategoryMutationRequest = UpdateExerciseCategoryRequest;
/**
 * @description OK
*/
export type UpdateCategoryMutationResponse = ExerciseCategoryResponse;
export type UpdateCategoryMutation = {
    Response: UpdateCategoryMutationResponse;
    Request: UpdateCategoryMutationRequest;
    PathParams: UpdateCategoryPathParams;
};