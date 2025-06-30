import { registerMutationRequestSchema, registerMutationResponseSchema } from "./registerSchema";
import { refreshTokenMutationRequestSchema, refreshTokenMutationResponseSchema } from "./refreshTokenSchema";
import { authenticateMutationRequestSchema, authenticateMutationResponseSchema } from "./authenticateSchema";
import { getAllPlansQueryResponseSchema } from "./getAllPlansSchema";
import { createPlanMutationRequestSchema, createPlanMutationResponseSchema } from "./createPlanSchema";
import { getAllExercisesQueryResponseSchema } from "./getAllExercisesSchema";
import { createExerciseMutationRequestSchema, createExerciseMutationResponseSchema } from "./createExerciseSchema";
import { getAllPlans1QueryResponseSchema } from "./getAllPlans1Schema";
import { getPlanByIdQueryResponseSchema, getPlanByIdPathParamsSchema } from "./getPlanByIdSchema";
import { getPlansByCategoryQueryResponseSchema, getPlansByCategoryPathParamsSchema } from "./getPlansByCategorySchema";
import { getPatientInfoQueryResponseSchema, getPatientInfoPathParamsSchema } from "./getPatientInfoSchema";
import { getPlanById1QueryResponseSchema, getPlanById1PathParamsSchema } from "./getPlanById1Schema";
import { getExerciseByIdQueryResponseSchema, getExerciseByIdPathParamsSchema } from "./getExerciseByIdSchema";
import { deleteExerciseMutationResponseSchema, deleteExercisePathParamsSchema } from "./deleteExerciseSchema";

 export const operations = { "register": {
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
    }, "refreshToken": {
        request: refreshTokenMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: refreshTokenMutationResponseSchema,
            default: refreshTokenMutationResponseSchema
        },
        errors: {}
    }, "authenticate": {
        request: authenticateMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: authenticateMutationResponseSchema,
            default: authenticateMutationResponseSchema
        },
        errors: {}
    }, "getAllPlans": {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getAllPlansQueryResponseSchema,
            default: getAllPlansQueryResponseSchema
        },
        errors: {}
    }, "createPlan": {
        request: createPlanMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: createPlanMutationResponseSchema,
            default: createPlanMutationResponseSchema
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
    }, "getAllPlans_1": {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getAllPlans1QueryResponseSchema,
            default: getAllPlans1QueryResponseSchema
        },
        errors: {}
    }, "getPlanById": {
        request: undefined,
        parameters: {
            path: getPlanByIdPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getPlanByIdQueryResponseSchema,
            default: getPlanByIdQueryResponseSchema
        },
        errors: {}
    }, "getPlansByCategory": {
        request: undefined,
        parameters: {
            path: getPlansByCategoryPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getPlansByCategoryQueryResponseSchema,
            default: getPlansByCategoryQueryResponseSchema
        },
        errors: {}
    }, "getPatientInfo": {
        request: undefined,
        parameters: {
            path: getPatientInfoPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getPatientInfoQueryResponseSchema,
            default: getPatientInfoQueryResponseSchema
        },
        errors: {}
    }, "getPlanById_1": {
        request: undefined,
        parameters: {
            path: getPlanById1PathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getPlanById1QueryResponseSchema,
            default: getPlanById1QueryResponseSchema
        },
        errors: {}
    }, "getExerciseById": {
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
    } } as const;
export const paths = { "/api/auth/register": {
        post: operations["register"]
    }, "/api/auth/refresh": {
        post: operations["refreshToken"]
    }, "/api/auth/login": {
        post: operations["authenticate"]
    }, "/api/admin/plans": {
        get: operations["getAllPlans"],
        post: operations["createPlan"]
    }, "/api/admin/exercises": {
        get: operations["getAllExercises"],
        post: operations["createExercise"]
    }, "/api/plans": {
        get: operations["getAllPlans_1"]
    }, "/api/plans/{id}": {
        get: operations["getPlanById"]
    }, "/api/plans/category/{category}": {
        get: operations["getPlansByCategory"]
    }, "/api/patients/{id}": {
        get: operations["getPatientInfo"]
    }, "/api/admin/plans/{id}": {
        get: operations["getPlanById_1"]
    }, "/api/admin/exercises/{id}": {
        get: operations["getExerciseById"],
        delete: operations["deleteExercise"]
    } } as const;