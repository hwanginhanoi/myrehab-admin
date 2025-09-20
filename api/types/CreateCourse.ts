import type { CourseResponse } from "./CourseResponse";
import type { CreateCourseRequest } from "./CreateCourseRequest";

 /**
 * @description OK
*/
export type CreateCourse200 = CourseResponse;
export type CreateCourseMutationRequest = CreateCourseRequest;
/**
 * @description OK
*/
export type CreateCourseMutationResponse = CourseResponse;
export type CreateCourseMutation = {
    Response: CreateCourseMutationResponse;
    Request: CreateCourseMutationRequest;
};