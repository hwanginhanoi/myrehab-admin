import type { CourseDto } from "./CourseDto";

 /**
 * @description OK
*/
export type CreateCourse200 = CourseDto;
export type CreateCourseMutationRequest = CourseDto;
/**
 * @description OK
*/
export type CreateCourseMutationResponse = CourseDto;
export type CreateCourseMutation = {
    Response: CreateCourseMutationResponse;
    Request: CreateCourseMutationRequest;
};