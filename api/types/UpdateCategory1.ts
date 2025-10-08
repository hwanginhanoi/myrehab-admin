import type { CourseCategoryResponse } from "./CourseCategoryResponse";
import type { UpdateCourseCategoryRequest } from "./UpdateCourseCategoryRequest";

 export type UpdateCategory1PathParams = {
    /**
     * @type integer, int64
    */
    id: number;
};
/**
 * @description OK
*/
export type UpdateCategory1200 = CourseCategoryResponse;
export type UpdateCategory1MutationRequest = UpdateCourseCategoryRequest;
/**
 * @description OK
*/
export type UpdateCategory1MutationResponse = CourseCategoryResponse;
export type UpdateCategory1Mutation = {
    Response: UpdateCategory1MutationResponse;
    Request: UpdateCategory1MutationRequest;
    PathParams: UpdateCategory1PathParams;
};