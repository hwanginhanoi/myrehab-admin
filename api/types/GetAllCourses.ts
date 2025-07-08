import type { Course } from "./Course";

 /**
 * @description OK
*/
export type GetAllCourses200 = Course[];
/**
 * @description OK
*/
export type GetAllCoursesQueryResponse = Course[];
export type GetAllCoursesQuery = {
    Response: GetAllCoursesQueryResponse;
};