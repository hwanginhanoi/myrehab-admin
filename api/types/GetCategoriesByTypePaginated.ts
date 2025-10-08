import type { PageExerciseCategoryResponse } from "./PageExerciseCategoryResponse";

 export const getCategoriesByTypePaginatedPathParamsType = {
    "BODY_PART": "BODY_PART",
    "RECOVERY_STAGE": "RECOVERY_STAGE",
    "HEALTH_CONDITION": "HEALTH_CONDITION",
    "DIFFICULTY_LEVEL": "DIFFICULTY_LEVEL",
    "EXERCISE_TYPE": "EXERCISE_TYPE"
} as const;
export type GetCategoriesByTypePaginatedPathParamsType = (typeof getCategoriesByTypePaginatedPathParamsType)[keyof typeof getCategoriesByTypePaginatedPathParamsType];
export type GetCategoriesByTypePaginatedPathParams = {
    /**
     * @type string
    */
    type: GetCategoriesByTypePaginatedPathParamsType;
};
export type GetCategoriesByTypePaginatedQueryParams = {
    /**
     * @description Page number (0-based)
     * @default 0
     * @type integer | undefined, int32
    */
    page?: number;
    /**
     * @description Number of items per page
     * @default 10
     * @type integer | undefined, int32
    */
    size?: number;
    /**
     * @description Sort by field
     * @default "name"
     * @type string | undefined
    */
    sortBy?: string;
    /**
     * @description Sort direction
     * @default "asc"
     * @type string | undefined
    */
    sortDir?: string;
};
/**
 * @description OK
*/
export type GetCategoriesByTypePaginated200 = PageExerciseCategoryResponse;
/**
 * @description OK
*/
export type GetCategoriesByTypePaginatedQueryResponse = PageExerciseCategoryResponse;
export type GetCategoriesByTypePaginatedQuery = {
    Response: GetCategoriesByTypePaginatedQueryResponse;
    PathParams: GetCategoriesByTypePaginatedPathParams;
    QueryParams: GetCategoriesByTypePaginatedQueryParams;
};