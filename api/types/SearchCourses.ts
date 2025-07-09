import type { CourseDto } from "./CourseDto";

 export type SearchCoursesQueryParams = {
    /**
     * @type string
    */
    title: string;
};
/**
 * @description OK
*/
export type SearchCourses200 = CourseDto[];
/**
 * @description OK
*/
export type SearchCoursesQueryResponse = CourseDto[];
export type SearchCoursesQuery = {
    Response: SearchCoursesQueryResponse;
    QueryParams: SearchCoursesQueryParams;
};