import type { PageExerciseResponse } from "./PageExerciseResponse";

 export type GetAllExercisesPaginatedQueryParams = {
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
     * @default "createdAt"
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
export type GetAllExercisesPaginated200 = PageExerciseResponse;
/**
 * @description OK
*/
export type GetAllExercisesPaginatedQueryResponse = PageExerciseResponse;
export type GetAllExercisesPaginatedQuery = {
    Response: GetAllExercisesPaginatedQueryResponse;
    QueryParams: GetAllExercisesPaginatedQueryParams;
};