import type { CourseResponse } from "./CourseResponse";

 /**
 * @description OK
*/
export type GetAllCourses200 = CourseResponse[];
/**
 * @description OK
*/
export type GetAllCoursesQueryResponse = CourseResponse[];
export type GetAllCoursesQuery = {
    Response: GetAllCoursesQueryResponse;
};