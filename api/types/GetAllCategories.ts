import type { ExerciseCategoryResponse } from "./ExerciseCategoryResponse";

 /**
 * @description OK
*/
export type GetAllCategories200 = ExerciseCategoryResponse[];
/**
 * @description OK
*/
export type GetAllCategoriesQueryResponse = ExerciseCategoryResponse[];
export type GetAllCategoriesQuery = {
    Response: GetAllCategoriesQueryResponse;
};