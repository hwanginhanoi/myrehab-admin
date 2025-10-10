import type { Pageable } from "./Pageable";
import type { PageCourseResponse } from "./PageCourseResponse";

 export type GetAllCoursesPaginatedQueryParams = {
    /**
     * @type object
    */
    pageable: Pageable;
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