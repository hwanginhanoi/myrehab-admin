import type { Course } from "./Course";

 /**
 * @description OK
*/
export type CreateCourse200 = Course;
export type CreateCourseMutationRequest = Course;
/**
 * @description OK
*/
export type CreateCourseMutationResponse = Course;
export type CreateCourseMutation = {
    Response: CreateCourseMutationResponse;
    Request: CreateCourseMutationRequest;
};