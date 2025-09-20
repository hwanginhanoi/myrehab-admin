import type { PageCourseResponse } from "./PageCourseResponse";

 export type GetAllCoursesPaginatedQueryParams = {
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
     * @default "desc"
     * @type string | undefined
    */
    sortDir?: string;
};
/**
 * @description OK
*/
export type GetAllCoursesPaginated200 = PageCourseResponse;
/**
 * @description OK
*/
export type GetAllCoursesPaginatedQueryResponse = PageCourseResponse;
export type GetAllCoursesPaginatedQuery = {
    Response: GetAllCoursesPaginatedQueryResponse;
    QueryParams: GetAllCoursesPaginatedQueryParams;
};