import type { Course } from "./Course";

 export type SearchCoursesByTitleQueryParams = {
    /**
     * @type string
    */
    title: string;
};
/**
 * @description OK
*/
export type SearchCoursesByTitle200 = Course[];
/**
 * @description OK
*/
export type SearchCoursesByTitleQueryResponse = Course[];
export type SearchCoursesByTitleQuery = {
    Response: SearchCoursesByTitleQueryResponse;
    QueryParams: SearchCoursesByTitleQueryParams;
};