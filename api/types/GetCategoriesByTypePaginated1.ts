import type { PageCourseCategoryResponse } from "./PageCourseCategoryResponse";

 export const getCategoriesByTypePaginated1PathParamsType = {
    "BODY_PART": "BODY_PART",
    "RECOVERY_STAGE": "RECOVERY_STAGE",
    "HEALTH_CONDITION": "HEALTH_CONDITION",
    "DIFFICULTY_LEVEL": "DIFFICULTY_LEVEL",
    "EXERCISE_TYPE": "EXERCISE_TYPE"
} as const;
export type GetCategoriesByTypePaginated1PathParamsType = (typeof getCategoriesByTypePaginated1PathParamsType)[keyof typeof getCategoriesByTypePaginated1PathParamsType];
export type GetCategoriesByTypePaginated1PathParams = {
    /**
     * @type string
    */
    type: GetCategoriesByTypePaginated1PathParamsType;
};
export type GetCategoriesByTypePaginated1QueryParams = {
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
export type GetCategoriesByTypePaginated1200 = PageCourseCategoryResponse;
/**
 * @description OK
*/
export type GetCategoriesByTypePaginated1QueryResponse = PageCourseCategoryResponse;
export type GetCategoriesByTypePaginated1Query = {
    Response: GetCategoriesByTypePaginated1QueryResponse;
    PathParams: GetCategoriesByTypePaginated1PathParams;
    QueryParams: GetCategoriesByTypePaginated1QueryParams;
};