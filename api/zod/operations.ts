import { getCourseByIdQueryResponseSchema, getCourseByIdPathParamsSchema } from "./getCourseByIdSchema";
import { updateCourseMutationRequestSchema, updateCourseMutationResponseSchema, updateCoursePathParamsSchema } from "./updateCourseSchema";
import { deleteCourseMutationResponseSchema, deleteCoursePathParamsSchema } from "./deleteCourseSchema";
import { getPatientByIdQueryResponseSchema, getPatientByIdPathParamsSchema } from "./getPatientByIdSchema";
import { updatePatientMutationRequestSchema, updatePatientMutationResponseSchema, updatePatientPathParamsSchema } from "./updatePatientSchema";
import { deletePatientMutationResponseSchema, deletePatientPathParamsSchema } from "./deletePatientSchema";
import { getAllCoursesQueryResponseSchema } from "./getAllCoursesSchema";
import { createCourseMutationRequestSchema, createCourseMutationResponseSchema } from "./createCourseSchema";
import { registerMutationRequestSchema, registerMutationResponseSchema } from "./registerSchema";
import { loginMutationRequestSchema, loginMutationResponseSchema } from "./loginSchema";
import { getAllPatientsQueryResponseSchema } from "./getAllPatientsSchema";
import { createPatientMutationRequestSchema, createPatientMutationResponseSchema } from "./createPatientSchema";
import { assignCourseToPatientMutationResponseSchema, assignCourseToPatientPathParamsSchema } from "./assignCourseToPatientSchema";
import { searchCoursesByTitleQueryResponseSchema, searchCoursesByTitleQueryParamsSchema } from "./searchCoursesByTitleSchema";
import { getCoursesByCategoryIdQueryResponseSchema, getCoursesByCategoryIdPathParamsSchema } from "./getCoursesByCategoryIdSchema";
import { searchPatientsQueryResponseSchema, searchPatientsQueryParamsSchema } from "./searchPatientsSchema";
import { removeCourseFromPatientMutationResponseSchema, removeCourseFromPatientPathParamsSchema } from "./removeCourseFromPatientSchema";

 export const operations = { "getCourseById": {
        request: undefined,
        parameters: {
            path: getCourseByIdPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getCourseByIdQueryResponseSchema,
            default: getCourseByIdQueryResponseSchema
        },
        errors: {}
    }, "updateCourse": {
        request: updateCourseMutationRequestSchema,
        parameters: {
            path: updateCoursePathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: updateCourseMutationResponseSchema,
            default: updateCourseMutationResponseSchema
        },
        errors: {}
    }, "deleteCourse": {
        request: undefined,
        parameters: {
            path: deleteCoursePathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: deleteCourseMutationResponseSchema,
            default: deleteCourseMutationResponseSchema
        },
        errors: {}
    }, "getPatientById": {
        request: undefined,
        parameters: {
            path: getPatientByIdPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getPatientByIdQueryResponseSchema,
            default: getPatientByIdQueryResponseSchema
        },
        errors: {}
    }, "updatePatient": {
        request: updatePatientMutationRequestSchema,
        parameters: {
            path: updatePatientPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: updatePatientMutationResponseSchema,
            default: updatePatientMutationResponseSchema
        },
        errors: {}
    }, "deletePatient": {
        request: undefined,
        parameters: {
            path: deletePatientPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: deletePatientMutationResponseSchema,
            default: deletePatientMutationResponseSchema
        },
        errors: {}
    }, "getAllCourses": {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getAllCoursesQueryResponseSchema,
            default: getAllCoursesQueryResponseSchema
        },
        errors: {}
    }, "createCourse": {
        request: createCourseMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: createCourseMutationResponseSchema,
            default: createCourseMutationResponseSchema
        },
        errors: {}
    }, "register": {
        request: registerMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: registerMutationResponseSchema,
            default: registerMutationResponseSchema
        },
        errors: {}
    }, "login": {
        request: loginMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: loginMutationResponseSchema,
            default: loginMutationResponseSchema
        },
        errors: {}
    }, "getAllPatients": {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getAllPatientsQueryResponseSchema,
            default: getAllPatientsQueryResponseSchema
        },
        errors: {}
    }, "createPatient": {
        request: createPatientMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: createPatientMutationResponseSchema,
            default: createPatientMutationResponseSchema
        },
        errors: {}
    }, "assignCourseToPatient": {
        request: undefined,
        parameters: {
            path: assignCourseToPatientPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: assignCourseToPatientMutationResponseSchema,
            default: assignCourseToPatientMutationResponseSchema
        },
        errors: {}
    }, "searchCoursesByTitle": {
        request: undefined,
        parameters: {
            path: undefined,
            query: searchCoursesByTitleQueryParamsSchema,
            header: undefined
        },
        responses: {
            200: searchCoursesByTitleQueryResponseSchema,
            default: searchCoursesByTitleQueryResponseSchema
        },
        errors: {}
    }, "getCoursesByCategoryId": {
        request: undefined,
        parameters: {
            path: getCoursesByCategoryIdPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getCoursesByCategoryIdQueryResponseSchema,
            default: getCoursesByCategoryIdQueryResponseSchema
        },
        errors: {}
    }, "searchPatients": {
        request: undefined,
        parameters: {
            path: undefined,
            query: searchPatientsQueryParamsSchema,
            header: undefined
        },
        responses: {
            200: searchPatientsQueryResponseSchema,
            default: searchPatientsQueryResponseSchema
        },
        errors: {}
    }, "removeCourseFromPatient": {
        request: undefined,
        parameters: {
            path: removeCourseFromPatientPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: removeCourseFromPatientMutationResponseSchema,
            default: removeCourseFromPatientMutationResponseSchema
        },
        errors: {}
    } } as const;
export const paths = { "/api/courses/{id}": {
        get: operations["getCourseById"],
        put: operations["updateCourse"],
        delete: operations["deleteCourse"]
    }, "/api/admin/patients/{id}": {
        get: operations["getPatientById"],
        put: operations["updatePatient"],
        delete: operations["deletePatient"]
    }, "/api/courses": {
        get: operations["getAllCourses"],
        post: operations["createCourse"]
    }, "/api/auth/register": {
        post: operations["register"]
    }, "/api/auth/login": {
        post: operations["login"]
    }, "/api/admin/patients": {
        get: operations["getAllPatients"],
        post: operations["createPatient"]
    }, "/api/admin/patients/{patientId}/assign-course/{courseId}": {
        post: operations["assignCourseToPatient"]
    }, "/api/courses/search": {
        get: operations["searchCoursesByTitle"]
    }, "/api/courses/category/{categoryId}": {
        get: operations["getCoursesByCategoryId"]
    }, "/api/admin/patients/search": {
        get: operations["searchPatients"]
    }, "/api/admin/patients/{patientId}/remove-course/{courseId}": {
        delete: operations["removeCourseFromPatient"]
    } } as const;