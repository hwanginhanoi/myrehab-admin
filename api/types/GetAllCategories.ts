import type { CategoryDto } from "./CategoryDto";

 /**
 * @description OK
*/
export type GetAllCategories200 = CategoryDto[];
/**
 * @description OK
*/
export type GetAllCategoriesQueryResponse = CategoryDto[];
export type GetAllCategoriesQuery = {
    Response: GetAllCategoriesQueryResponse;
};