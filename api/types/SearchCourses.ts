import type { CourseResponse } from "./CourseResponse";

 export type SearchCoursesQueryParams = {
    /**
     * @description Search keyword
     * @type string
    */
    keyword: string;
};
/**
 * @description OK
*/
export type SearchCourses200 = CourseResponse[];
/**
 * @description OK
*/
export type SearchCoursesQueryResponse = CourseResponse[];
export type SearchCoursesQuery = {
    Response: SearchCoursesQueryResponse;
    QueryParams: SearchCoursesQueryParams;
};