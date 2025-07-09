import type { CategoryDto } from "./CategoryDto";

 export const getCategoriesByTypePathParamsType = {
    "BODY_PART": "BODY_PART",
    "RECOVERY_STAGE": "RECOVERY_STAGE",
    "HEALTH_CONDITION": "HEALTH_CONDITION"
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
export type GetCategoriesByType200 = CategoryDto[];
/**
 * @description OK
*/
export type GetCategoriesByTypeQueryResponse = CategoryDto[];
export type GetCategoriesByTypeQuery = {
    Response: GetCategoriesByTypeQueryResponse;
    PathParams: GetCategoriesByTypePathParams;
};