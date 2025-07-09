import type { CourseDto } from "./CourseDto";

 /**
 * @description OK
*/
export type GetAllCourses200 = CourseDto[];
/**
 * @description OK
*/
export type GetAllCoursesQueryResponse = CourseDto[];
export type GetAllCoursesQuery = {
    Response: GetAllCoursesQueryResponse;
};