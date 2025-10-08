import type { CourseCategoryResponse } from "./CourseCategoryResponse";

 /**
 * @description OK
*/
export type GetAllCategories1200 = CourseCategoryResponse[];
/**
 * @description OK
*/
export type GetAllCategories1QueryResponse = CourseCategoryResponse[];
export type GetAllCategories1Query = {
    Response: GetAllCategories1QueryResponse;
};