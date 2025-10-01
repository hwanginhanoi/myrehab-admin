import { getExerciseByIdQueryResponseSchema, getExerciseByIdPathParamsSchema } from "./getExerciseByIdSchema";
import { updateExerciseMutationRequestSchema, updateExerciseMutationResponseSchema, updateExercisePathParamsSchema } from "./updateExerciseSchema";
import { deleteExerciseMutationResponseSchema, deleteExercisePathParamsSchema } from "./deleteExerciseSchema";
import { getCategoryByIdQueryResponseSchema, getCategoryByIdPathParamsSchema } from "./getCategoryByIdSchema";
import { updateCategoryMutationRequestSchema, updateCategoryMutationResponseSchema, updateCategoryPathParamsSchema } from "./updateCategorySchema";
import { deleteCategoryMutationResponseSchema, deleteCategoryPathParamsSchema } from "./deleteCategorySchema";
import { buyCourseMutationResponseSchema, buyCoursePathParamsSchema } from "./buyCourseSchema";
import { uploadVideoMutationRequestSchema, uploadVideoMutationResponseSchema } from "./uploadVideoSchema";
import { uploadImageMutationRequestSchema, uploadImageMutationResponseSchema } from "./uploadImageSchema";
import { generatePresignedUploadUrlMutationRequestSchema, generatePresignedUploadUrlMutationResponseSchema } from "./generatePresignedUploadUrlSchema";
import { createExerciseMutationRequestSchema, createExerciseMutationResponseSchema } from "./createExerciseSchema";
import { getAllCoursesQueryResponseSchema } from "./getAllCoursesSchema";
import { createCourseMutationRequestSchema, createCourseMutationResponseSchema } from "./createCourseSchema";
import { getAllCategoriesQueryResponseSchema } from "./getAllCategoriesSchema";
import { createCategoryMutationRequestSchema, createCategoryMutationResponseSchema } from "./createCategorySchema";
import { addBalanceToUserMutationRequestSchema, addBalanceToUserMutationResponseSchema, addBalanceToUserPathParamsSchema } from "./addBalanceToUserSchema";
import { addBalanceMutationRequestSchema, addBalanceMutationResponseSchema } from "./addBalanceSchema";
import { verifyOtpAndLoginMutationRequestSchema, verifyOtpAndLoginMutationResponseSchema } from "./verifyOtpAndLoginSchema";
import { sendOtpForUserMutationRequestSchema, sendOtpForUserMutationResponseSchema } from "./sendOtpForUserSchema";
import { staffLoginMutationRequestSchema, staffLoginMutationResponseSchema } from "./staffLoginSchema";
import { refreshTokenMutationRequestSchema, refreshTokenMutationResponseSchema } from "./refreshTokenSchema";
import { logoutMutationRequestSchema, logoutMutationResponseSchema } from "./logoutSchema";
import { getAllUsersQueryResponseSchema } from "./getAllUsersSchema";
import { getMyPurchasesQueryResponseSchema } from "./getMyPurchasesSchema";
import { getMyPurchasesPaginatedQueryResponseSchema, getMyPurchasesPaginatedQueryParamsSchema } from "./getMyPurchasesPaginatedSchema";
import { checkCourseOwnershipQueryResponseSchema, checkCourseOwnershipPathParamsSchema } from "./checkCourseOwnershipSchema";
import { generateVideoViewingUrlQueryResponseSchema, generateVideoViewingUrlQueryParamsSchema } from "./generateVideoViewingUrlSchema";
import { generatePresignedAccessUrlQueryResponseSchema, generatePresignedAccessUrlPathParamsSchema, generatePresignedAccessUrlQueryParamsSchema } from "./generatePresignedAccessUrlSchema";
import { getAllExercisesPaginatedQueryResponseSchema, getAllExercisesPaginatedQueryParamsSchema } from "./getAllExercisesPaginatedSchema";
import { getCourseByIdQueryResponseSchema, getCourseByIdPathParamsSchema } from "./getCourseByIdSchema";
import { searchCoursesQueryResponseSchema, searchCoursesQueryParamsSchema } from "./searchCoursesSchema";
import { getAllCoursesPaginatedQueryResponseSchema, getAllCoursesPaginatedQueryParamsSchema } from "./getAllCoursesPaginatedSchema";
import { getCoursesByCategoryQueryResponseSchema, getCoursesByCategoryPathParamsSchema } from "./getCoursesByCategorySchema";
import { getCategoriesByTypeQueryResponseSchema, getCategoriesByTypePathParamsSchema } from "./getCategoriesByTypeSchema";
import { getCategoriesByTypePaginatedQueryResponseSchema, getCategoriesByTypePaginatedPathParamsSchema, getCategoriesByTypePaginatedQueryParamsSchema } from "./getCategoriesByTypePaginatedSchema";
import { searchCategoriesQueryResponseSchema, searchCategoriesQueryParamsSchema } from "./searchCategoriesSchema";
import { searchCategoriesPaginatedQueryResponseSchema, searchCategoriesPaginatedQueryParamsSchema } from "./searchCategoriesPaginatedSchema";
import { getAllCategoriesPaginatedQueryResponseSchema, getAllCategoriesPaginatedQueryParamsSchema } from "./getAllCategoriesPaginatedSchema";
import { getUserBalanceQueryResponseSchema } from "./getUserBalanceSchema";
import { getTransactionHistoryQueryResponseSchema } from "./getTransactionHistorySchema";
import { getAllUsers1QueryResponseSchema } from "./getAllUsers1Schema";
import { getAllUsersPaginatedQueryResponseSchema, getAllUsersPaginatedQueryParamsSchema } from "./getAllUsersPaginatedSchema";
import { deleteFileMutationResponseSchema, deleteFileQueryParamsSchema } from "./deleteFileSchema";

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
    }, "buyCourse": {
        request: undefined,
        parameters: {
            path: buyCoursePathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: buyCourseMutationResponseSchema,
            default: buyCourseMutationResponseSchema
        },
        errors: {}
    }, "uploadVideo": {
        request: uploadVideoMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: uploadVideoMutationResponseSchema,
            default: uploadVideoMutationResponseSchema
        },
        errors: {}
    }, "uploadImage": {
        request: uploadImageMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: uploadImageMutationResponseSchema,
            default: uploadImageMutationResponseSchema
        },
        errors: {}
    }, "generatePresignedUploadUrl": {
        request: generatePresignedUploadUrlMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: generatePresignedUploadUrlMutationResponseSchema,
            default: generatePresignedUploadUrlMutationResponseSchema
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
    }, "addBalanceToUser": {
        request: addBalanceToUserMutationRequestSchema,
        parameters: {
            path: addBalanceToUserPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: addBalanceToUserMutationResponseSchema,
            default: addBalanceToUserMutationResponseSchema
        },
        errors: {}
    }, "addBalance": {
        request: addBalanceMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: addBalanceMutationResponseSchema,
            default: addBalanceMutationResponseSchema
        },
        errors: {}
    }, "verifyOtpAndLogin": {
        request: verifyOtpAndLoginMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: verifyOtpAndLoginMutationResponseSchema,
            default: verifyOtpAndLoginMutationResponseSchema
        },
        errors: {}
    }, "sendOtpForUser": {
        request: sendOtpForUserMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: sendOtpForUserMutationResponseSchema,
            default: sendOtpForUserMutationResponseSchema
        },
        errors: {}
    }, "staffLogin": {
        request: staffLoginMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: staffLoginMutationResponseSchema,
            default: staffLoginMutationResponseSchema
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
    }, "logout": {
        request: logoutMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: logoutMutationResponseSchema,
            default: logoutMutationResponseSchema
        },
        errors: {}
    }, "getAllUsers": {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getAllUsersQueryResponseSchema,
            default: getAllUsersQueryResponseSchema
        },
        errors: {}
    }, "getMyPurchases": {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getMyPurchasesQueryResponseSchema,
            default: getMyPurchasesQueryResponseSchema
        },
        errors: {}
    }, "getMyPurchasesPaginated": {
        request: undefined,
        parameters: {
            path: undefined,
            query: getMyPurchasesPaginatedQueryParamsSchema,
            header: undefined
        },
        responses: {
            200: getMyPurchasesPaginatedQueryResponseSchema,
            default: getMyPurchasesPaginatedQueryResponseSchema
        },
        errors: {}
    }, "checkCourseOwnership": {
        request: undefined,
        parameters: {
            path: checkCourseOwnershipPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: checkCourseOwnershipQueryResponseSchema,
            default: checkCourseOwnershipQueryResponseSchema
        },
        errors: {}
    }, "generateVideoViewingUrl": {
        request: undefined,
        parameters: {
            path: undefined,
            query: generateVideoViewingUrlQueryParamsSchema,
            header: undefined
        },
        responses: {
            200: generateVideoViewingUrlQueryResponseSchema,
            default: generateVideoViewingUrlQueryResponseSchema
        },
        errors: {}
    }, "generatePresignedAccessUrl": {
        request: undefined,
        parameters: {
            path: generatePresignedAccessUrlPathParamsSchema,
            query: generatePresignedAccessUrlQueryParamsSchema,
            header: undefined
        },
        responses: {
            200: generatePresignedAccessUrlQueryResponseSchema,
            default: generatePresignedAccessUrlQueryResponseSchema
        },
        errors: {}
    }, "getAllExercisesPaginated": {
        request: undefined,
        parameters: {
            path: undefined,
            query: getAllExercisesPaginatedQueryParamsSchema,
            header: undefined
        },
        responses: {
            200: getAllExercisesPaginatedQueryResponseSchema,
            default: getAllExercisesPaginatedQueryResponseSchema
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
    }, "getAllCoursesPaginated": {
        request: undefined,
        parameters: {
            path: undefined,
            query: getAllCoursesPaginatedQueryParamsSchema,
            header: undefined
        },
        responses: {
            200: getAllCoursesPaginatedQueryResponseSchema,
            default: getAllCoursesPaginatedQueryResponseSchema
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
    }, "getCategoriesByTypePaginated": {
        request: undefined,
        parameters: {
            path: getCategoriesByTypePaginatedPathParamsSchema,
            query: getCategoriesByTypePaginatedQueryParamsSchema,
            header: undefined
        },
        responses: {
            200: getCategoriesByTypePaginatedQueryResponseSchema,
            default: getCategoriesByTypePaginatedQueryResponseSchema
        },
        errors: {}
    }, "searchCategories": {
        request: undefined,
        parameters: {
            path: undefined,
            query: searchCategoriesQueryParamsSchema,
            header: undefined
        },
        responses: {
            200: searchCategoriesQueryResponseSchema,
            default: searchCategoriesQueryResponseSchema
        },
        errors: {}
    }, "searchCategoriesPaginated": {
        request: undefined,
        parameters: {
            path: undefined,
            query: searchCategoriesPaginatedQueryParamsSchema,
            header: undefined
        },
        responses: {
            200: searchCategoriesPaginatedQueryResponseSchema,
            default: searchCategoriesPaginatedQueryResponseSchema
        },
        errors: {}
    }, "getAllCategoriesPaginated": {
        request: undefined,
        parameters: {
            path: undefined,
            query: getAllCategoriesPaginatedQueryParamsSchema,
            header: undefined
        },
        responses: {
            200: getAllCategoriesPaginatedQueryResponseSchema,
            default: getAllCategoriesPaginatedQueryResponseSchema
        },
        errors: {}
    }, "getUserBalance": {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getUserBalanceQueryResponseSchema,
            default: getUserBalanceQueryResponseSchema
        },
        errors: {}
    }, "getTransactionHistory": {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getTransactionHistoryQueryResponseSchema,
            default: getTransactionHistoryQueryResponseSchema
        },
        errors: {}
    }, "getAllUsers_1": {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getAllUsers1QueryResponseSchema,
            default: getAllUsers1QueryResponseSchema
        },
        errors: {}
    }, "getAllUsersPaginated": {
        request: undefined,
        parameters: {
            path: undefined,
            query: getAllUsersPaginatedQueryParamsSchema,
            header: undefined
        },
        responses: {
            200: getAllUsersPaginatedQueryResponseSchema,
            default: getAllUsersPaginatedQueryResponseSchema
        },
        errors: {}
    }, "deleteFile": {
        request: undefined,
        parameters: {
            path: undefined,
            query: deleteFileQueryParamsSchema,
            header: undefined
        },
        responses: {
            200: deleteFileMutationResponseSchema,
            default: deleteFileMutationResponseSchema
        },
        errors: {}
    } } as const;
export const paths = { "/api/exercises/{id}": {
        get: operations["getExerciseById"],
        put: operations["updateExercise"],
        delete: operations["deleteExercise"]
    }, "/api/categories/{id}": {
        get: operations["getCategoryById"],
        put: operations["updateCategory"],
        delete: operations["deleteCategory"]
    }, "/api/purchases/course/{courseId}": {
        post: operations["buyCourse"]
    }, "/api/files/upload/video": {
        post: operations["uploadVideo"]
    }, "/api/files/upload/image": {
        post: operations["uploadImage"]
    }, "/api/files/presigned-url": {
        post: operations["generatePresignedUploadUrl"]
    }, "/api/exercises": {
        post: operations["createExercise"]
    }, "/api/courses": {
        get: operations["getAllCourses"],
        post: operations["createCourse"]
    }, "/api/categories": {
        get: operations["getAllCategories"],
        post: operations["createCategory"]
    }, "/api/balance/admin/add/{userId}": {
        post: operations["addBalanceToUser"]
    }, "/api/balance/add": {
        post: operations["addBalance"]
    }, "/api/auth/user/verify-otp": {
        post: operations["verifyOtpAndLogin"]
    }, "/api/auth/user/send-otp": {
        post: operations["sendOtpForUser"]
    }, "/api/auth/staff/login": {
        post: operations["staffLogin"]
    }, "/api/auth/refresh-token": {
        post: operations["refreshToken"]
    }, "/api/auth/logout": {
        post: operations["logout"]
    }, "/api/users": {
        get: operations["getAllUsers"]
    }, "/api/purchases": {
        get: operations["getMyPurchases"]
    }, "/api/purchases/paginated": {
        get: operations["getMyPurchasesPaginated"]
    }, "/api/purchases/check/course/{courseId}": {
        get: operations["checkCourseOwnership"]
    }, "/api/files/view/video": {
        get: operations["generateVideoViewingUrl"]
    }, "/api/files/presigned-url/{folder}/{fileName}": {
        get: operations["generatePresignedAccessUrl"]
    }, "/api/exercises/paginated": {
        get: operations["getAllExercisesPaginated"]
    }, "/api/courses/{id}": {
        get: operations["getCourseById"]
    }, "/api/courses/search": {
        get: operations["searchCourses"]
    }, "/api/courses/paginated": {
        get: operations["getAllCoursesPaginated"]
    }, "/api/courses/category/{categoryId}": {
        get: operations["getCoursesByCategory"]
    }, "/api/categories/type/{type}": {
        get: operations["getCategoriesByType"]
    }, "/api/categories/type/{type}/paginated": {
        get: operations["getCategoriesByTypePaginated"]
    }, "/api/categories/search": {
        get: operations["searchCategories"]
    }, "/api/categories/search/paginated": {
        get: operations["searchCategoriesPaginated"]
    }, "/api/categories/paginated": {
        get: operations["getAllCategoriesPaginated"]
    }, "/api/balance": {
        get: operations["getUserBalance"]
    }, "/api/balance/transactions": {
        get: operations["getTransactionHistory"]
    }, "/api/admin/users": {
        get: operations["getAllUsers_1"]
    }, "/api/admin/users/paginated": {
        get: operations["getAllUsersPaginated"]
    }, "/api/files/delete": {
        delete: operations["deleteFile"]
    } } as const;