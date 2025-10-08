import type { CourseCategoryResponse } from "./CourseCategoryResponse";

 export const getCategoriesByType1PathParamsType = {
    "BODY_PART": "BODY_PART",
    "RECOVERY_STAGE": "RECOVERY_STAGE",
    "HEALTH_CONDITION": "HEALTH_CONDITION",
    "DIFFICULTY_LEVEL": "DIFFICULTY_LEVEL",
    "EXERCISE_TYPE": "EXERCISE_TYPE"
} as const;
export type GetCategoriesByType1PathParamsType = (typeof getCategoriesByType1PathParamsType)[keyof typeof getCategoriesByType1PathParamsType];
export type GetCategoriesByType1PathParams = {
    /**
     * @type string
    */
    type: GetCategoriesByType1PathParamsType;
};
/**
 * @description OK
*/
export type GetCategoriesByType1200 = CourseCategoryResponse[];
/**
 * @description OK
*/
export type GetCategoriesByType1QueryResponse = CourseCategoryResponse[];
export type GetCategoriesByType1Query = {
    Response: GetCategoriesByType1QueryResponse;
    PathParams: GetCategoriesByType1PathParams;
};