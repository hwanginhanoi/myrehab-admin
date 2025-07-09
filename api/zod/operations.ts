import { getExerciseByIdQueryResponseSchema, getExerciseByIdPathParamsSchema } from "./getExerciseByIdSchema";
import { updateExerciseMutationRequestSchema, updateExerciseMutationResponseSchema, updateExercisePathParamsSchema } from "./updateExerciseSchema";
import { deleteExerciseMutationResponseSchema, deleteExercisePathParamsSchema } from "./deleteExerciseSchema";
import { getCourseByIdQueryResponseSchema, getCourseByIdPathParamsSchema } from "./getCourseByIdSchema";
import { updateCourseMutationRequestSchema, updateCourseMutationResponseSchema, updateCoursePathParamsSchema } from "./updateCourseSchema";
import { deleteCourseMutationResponseSchema, deleteCoursePathParamsSchema } from "./deleteCourseSchema";
import { getCategoryByIdQueryResponseSchema, getCategoryByIdPathParamsSchema } from "./getCategoryByIdSchema";
import { updateCategoryMutationRequestSchema, updateCategoryMutationResponseSchema, updateCategoryPathParamsSchema } from "./updateCategorySchema";
import { deleteCategoryMutationResponseSchema, deleteCategoryPathParamsSchema } from "./deleteCategorySchema";
import { assignCourseToPatientMutationResponseSchema, assignCourseToPatientPathParamsSchema } from "./assignCourseToPatientSchema";
import { removeCourseFromPatientMutationResponseSchema, removeCourseFromPatientPathParamsSchema } from "./removeCourseFromPatientSchema";
import { getAllExercisesQueryResponseSchema } from "./getAllExercisesSchema";
import { createExerciseMutationRequestSchema, createExerciseMutationResponseSchema } from "./createExerciseSchema";
import { addCategoryToExerciseMutationResponseSchema, addCategoryToExercisePathParamsSchema } from "./addCategoryToExerciseSchema";
import { removeCategoryFromExerciseMutationResponseSchema, removeCategoryFromExercisePathParamsSchema } from "./removeCategoryFromExerciseSchema";
import { getAllCoursesQueryResponseSchema } from "./getAllCoursesSchema";
import { createCourseMutationRequestSchema, createCourseMutationResponseSchema } from "./createCourseSchema";
import { addExerciseToCourseMutationResponseSchema, addExerciseToCoursePathParamsSchema } from "./addExerciseToCourseSchema";
import { removeExerciseFromCourseMutationResponseSchema, removeExerciseFromCoursePathParamsSchema } from "./removeExerciseFromCourseSchema";
import { getAllCategoriesQueryResponseSchema } from "./getAllCategoriesSchema";
import { createCategoryMutationRequestSchema, createCategoryMutationResponseSchema } from "./createCategorySchema";
import { registerMutationRequestSchema, registerMutationResponseSchema } from "./registerSchema";
import { loginMutationRequestSchema, loginMutationResponseSchema } from "./loginSchema";
import { getAllPatientsQueryResponseSchema } from "./getAllPatientsSchema";
import { getPurchasedExercisesQueryResponseSchema, getPurchasedExercisesPathParamsSchema } from "./getPurchasedExercisesSchema";
import { getPurchasedCoursesQueryResponseSchema, getPurchasedCoursesPathParamsSchema } from "./getPurchasedCoursesSchema";
import { getAssignedCoursesQueryResponseSchema, getAssignedCoursesPathParamsSchema } from "./getAssignedCoursesSchema";
import { getPatientByIdQueryResponseSchema, getPatientByIdPathParamsSchema } from "./getPatientByIdSchema";
import { searchExercisesQueryResponseSchema, searchExercisesQueryParamsSchema } from "./searchExercisesSchema";
import { getExercisesByCategoryQueryResponseSchema, getExercisesByCategoryPathParamsSchema } from "./getExercisesByCategorySchema";
import { searchCoursesQueryResponseSchema, searchCoursesQueryParamsSchema } from "./searchCoursesSchema";
import { getCoursesByCategoryQueryResponseSchema, getCoursesByCategoryPathParamsSchema } from "./getCoursesByCategorySchema";
import { getCategoriesByTypeQueryResponseSchema, getCategoriesByTypePathParamsSchema } from "./getCategoriesByTypeSchema";

 export const operations = { "getExerciseById": {
        request: undefined,
        parameters: {
            path: getExerciseByIdPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getExerciseByIdQueryResponseSchema,
            default: getExerciseByIdQueryResponseSchema
        },
        errors: {}
    }, "updateExercise": {
        request: updateExerciseMutationRequestSchema,
        parameters: {
            path: updateExercisePathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: updateExerciseMutationResponseSchema,
            default: updateExerciseMutationResponseSchema
        },
        errors: {}
    }, "deleteExercise": {
        request: undefined,
        parameters: {
            path: deleteExercisePathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: deleteExerciseMutationResponseSchema,
            default: deleteExerciseMutationResponseSchema
        },
        errors: {}
    }, "getCourseById": {
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
    }, "getCategoryById": {
        request: undefined,
        parameters: {
            path: getCategoryByIdPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getCategoryByIdQueryResponseSchema,
            default: getCategoryByIdQueryResponseSchema
        },
        errors: {}
    }, "updateCategory": {
        request: updateCategoryMutationRequestSchema,
        parameters: {
            path: updateCategoryPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: updateCategoryMutationResponseSchema,
            default: updateCategoryMutationResponseSchema
        },
        errors: {}
    }, "deleteCategory": {
        request: undefined,
        parameters: {
            path: deleteCategoryPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: deleteCategoryMutationResponseSchema,
            default: deleteCategoryMutationResponseSchema
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
    }, "getAllExercises": {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getAllExercisesQueryResponseSchema,
            default: getAllExercisesQueryResponseSchema
        },
        errors: {}
    }, "createExercise": {
        request: createExerciseMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: createExerciseMutationResponseSchema,
            default: createExerciseMutationResponseSchema
        },
        errors: {}
    }, "addCategoryToExercise": {
        request: undefined,
        parameters: {
            path: addCategoryToExercisePathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: addCategoryToExerciseMutationResponseSchema,
            default: addCategoryToExerciseMutationResponseSchema
        },
        errors: {}
    }, "removeCategoryFromExercise": {
        request: undefined,
        parameters: {
            path: removeCategoryFromExercisePathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: removeCategoryFromExerciseMutationResponseSchema,
            default: removeCategoryFromExerciseMutationResponseSchema
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
    }, "addExerciseToCourse": {
        request: undefined,
        parameters: {
            path: addExerciseToCoursePathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: addExerciseToCourseMutationResponseSchema,
            default: addExerciseToCourseMutationResponseSchema
        },
        errors: {}
    }, "removeExerciseFromCourse": {
        request: undefined,
        parameters: {
            path: removeExerciseFromCoursePathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: removeExerciseFromCourseMutationResponseSchema,
            default: removeExerciseFromCourseMutationResponseSchema
        },
        errors: {}
    }, "getAllCategories": {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getAllCategoriesQueryResponseSchema,
            default: getAllCategoriesQueryResponseSchema
        },
        errors: {}
    }, "createCategory": {
        request: createCategoryMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: createCategoryMutationResponseSchema,
            default: createCategoryMutationResponseSchema
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
    }, "getPurchasedExercises": {
        request: undefined,
        parameters: {
            path: getPurchasedExercisesPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getPurchasedExercisesQueryResponseSchema,
            default: getPurchasedExercisesQueryResponseSchema
        },
        errors: {}
    }, "getPurchasedCourses": {
        request: undefined,
        parameters: {
            path: getPurchasedCoursesPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getPurchasedCoursesQueryResponseSchema,
            default: getPurchasedCoursesQueryResponseSchema
        },
        errors: {}
    }, "getAssignedCourses": {
        request: undefined,
        parameters: {
            path: getAssignedCoursesPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getAssignedCoursesQueryResponseSchema,
            default: getAssignedCoursesQueryResponseSchema
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
    }, "searchExercises": {
        request: undefined,
        parameters: {
            path: undefined,
            query: searchExercisesQueryParamsSchema,
            header: undefined
        },
        responses: {
            200: searchExercisesQueryResponseSchema,
            default: searchExercisesQueryResponseSchema
        },
        errors: {}
    }, "getExercisesByCategory": {
        request: undefined,
        parameters: {
            path: getExercisesByCategoryPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getExercisesByCategoryQueryResponseSchema,
            default: getExercisesByCategoryQueryResponseSchema
        },
        errors: {}
    }, "searchCourses": {
        request: undefined,
        parameters: {
            path: undefined,
            query: searchCoursesQueryParamsSchema,
            header: undefined
        },
        responses: {
            200: searchCoursesQueryResponseSchema,
            default: searchCoursesQueryResponseSchema
        },
        errors: {}
    }, "getCoursesByCategory": {
        request: undefined,
        parameters: {
            path: getCoursesByCategoryPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getCoursesByCategoryQueryResponseSchema,
            default: getCoursesByCategoryQueryResponseSchema
        },
        errors: {}
    }, "getCategoriesByType": {
        request: undefined,
        parameters: {
            path: getCategoriesByTypePathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getCategoriesByTypeQueryResponseSchema,
            default: getCategoriesByTypeQueryResponseSchema
        },
        errors: {}
    } } as const;
export const paths = { "/api/exercises/{id}": {
        get: operations["getExerciseById"],
        put: operations["updateExercise"],
        delete: operations["deleteExercise"]
    }, "/api/courses/{id}": {
        get: operations["getCourseById"],
        put: operations["updateCourse"],
        delete: operations["deleteCourse"]
    }, "/api/categories/{id}": {
        get: operations["getCategoryById"],
        put: operations["updateCategory"],
        delete: operations["deleteCategory"]
    }, "/api/patients/{patientId}/courses/{courseId}/assign": {
        post: operations["assignCourseToPatient"],
        delete: operations["removeCourseFromPatient"]
    }, "/api/exercises": {
        get: operations["getAllExercises"],
        post: operations["createExercise"]
    }, "/api/exercises/{exerciseId}/categories/{categoryId}": {
        post: operations["addCategoryToExercise"],
        delete: operations["removeCategoryFromExercise"]
    }, "/api/courses": {
        get: operations["getAllCourses"],
        post: operations["createCourse"]
    }, "/api/courses/{courseId}/exercises/{exerciseId}": {
        post: operations["addExerciseToCourse"],
        delete: operations["removeExerciseFromCourse"]
    }, "/api/categories": {
        get: operations["getAllCategories"],
        post: operations["createCategory"]
    }, "/api/auth/register": {
        post: operations["register"]
    }, "/api/auth/login": {
        post: operations["login"]
    }, "/api/patients": {
        get: operations["getAllPatients"]
    }, "/api/patients/{patientId}/exercises/purchased": {
        get: operations["getPurchasedExercises"]
    }, "/api/patients/{patientId}/courses/purchased": {
        get: operations["getPurchasedCourses"]
    }, "/api/patients/{patientId}/courses/assigned": {
        get: operations["getAssignedCourses"]
    }, "/api/patients/{id}": {
        get: operations["getPatientById"]
    }, "/api/exercises/search": {
        get: operations["searchExercises"]
    }, "/api/exercises/category/{categoryId}": {
        get: operations["getExercisesByCategory"]
    }, "/api/courses/search": {
        get: operations["searchCourses"]
    }, "/api/courses/category/{categoryId}": {
        get: operations["getCoursesByCategory"]
    }, "/api/categories/type/{type}": {
        get: operations["getCategoriesByType"]
    } } as const;