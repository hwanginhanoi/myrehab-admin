import type { Pageable } from "./Pageable";
import type { PageExerciseResponse } from "./PageExerciseResponse";

 export type GetAllExercisesPaginatedQueryParams = {
    /**
     * @type object
    */
    pageable: Pageable;
    /**
     * @type integer | undefined, int64
    */
    categoryId?: number;
    /**
     * @type string | undefined
    */
    keyword?: string;
};
/**
 * @description OK
*/
export type GetAllExercisesPaginated200 = PageExerciseResponse;
/**
 * @description OK
*/
export type GetAllExercisesPaginatedQueryResponse = PageExerciseResponse;
export type GetAllExercisesPaginatedQuery = {
    Response: GetAllExercisesPaginatedQueryResponse;
    QueryParams: GetAllExercisesPaginatedQueryParams;
};