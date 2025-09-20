import type { CategoryResponse } from "./CategoryResponse";

 /**
 * @description OK
*/
export type GetAllCategories200 = CategoryResponse[];
/**
 * @description OK
*/
export type GetAllCategoriesQueryResponse = CategoryResponse[];
export type GetAllCategoriesQuery = {
    Response: GetAllCategoriesQueryResponse;
};