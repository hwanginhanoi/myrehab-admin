import type { ExerciseCategoryResponse } from "./ExerciseCategoryResponse";

 export const getCategoriesByTypePathParamsType = {
    "BODY_PART": "BODY_PART",
    "RECOVERY_STAGE": "RECOVERY_STAGE",
    "HEALTH_CONDITION": "HEALTH_CONDITION",
    "DIFFICULTY_LEVEL": "DIFFICULTY_LEVEL",
    "EXERCISE_TYPE": "EXERCISE_TYPE"
} as const;
export type GetCategoriesByTypePathParamsType = (typeof getCategoriesByTypePathParamsType)[keyof typeof getCategoriesByTypePathParamsType];
export type GetCategoriesByTypePathParams = {
    /**
     * @type string
    */
    type: GetCategoriesByTypePathParamsType;
};
/**
 * @description OK
*/
export type GetCategoriesByType200 = ExerciseCategoryResponse[];
/**
 * @description OK
*/
export type GetCategoriesByTypeQueryResponse = ExerciseCategoryResponse[];
export type GetCategoriesByTypeQuery = {
    Response: GetCategoriesByTypeQueryResponse;
    PathParams: GetCategoriesByTypePathParams;
};