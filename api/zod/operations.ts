import { getUserProfileQueryResponseSchema, getUserProfilePathParamsSchema } from "./getUserProfileSchema";
import { updateUserProfileMutationRequestSchema, updateUserProfileMutationResponseSchema, updateUserProfilePathParamsSchema } from "./updateUserProfileSchema";
import { deleteUserProfileMutationResponseSchema, deleteUserProfilePathParamsSchema } from "./deleteUserProfileSchema";
import { getNonCompulsoryHealthInsuranceQueryResponseSchema, getNonCompulsoryHealthInsurancePathParamsSchema } from "./getNonCompulsoryHealthInsuranceSchema";
import { updateNonCompulsoryHealthInsuranceMutationRequestSchema, updateNonCompulsoryHealthInsuranceMutationResponseSchema, updateNonCompulsoryHealthInsurancePathParamsSchema } from "./updateNonCompulsoryHealthInsuranceSchema";
import { deleteNonCompulsoryHealthInsuranceMutationResponseSchema, deleteNonCompulsoryHealthInsurancePathParamsSchema } from "./deleteNonCompulsoryHealthInsuranceSchema";
import { getNationalHealthInsuranceQueryResponseSchema, getNationalHealthInsurancePathParamsSchema } from "./getNationalHealthInsuranceSchema";
import { updateNationalHealthInsuranceMutationRequestSchema, updateNationalHealthInsuranceMutationResponseSchema, updateNationalHealthInsurancePathParamsSchema } from "./updateNationalHealthInsuranceSchema";
import { deleteNationalHealthInsuranceMutationResponseSchema, deleteNationalHealthInsurancePathParamsSchema } from "./deleteNationalHealthInsuranceSchema";
import { getUserCompanyInfoQueryResponseSchema, getUserCompanyInfoPathParamsSchema } from "./getUserCompanyInfoSchema";
import { updateUserCompanyInfoMutationRequestSchema, updateUserCompanyInfoMutationResponseSchema, updateUserCompanyInfoPathParamsSchema } from "./updateUserCompanyInfoSchema";
import { deleteUserCompanyInfoMutationResponseSchema, deleteUserCompanyInfoPathParamsSchema } from "./deleteUserCompanyInfoSchema";
import { getUserBasicInfoQueryResponseSchema, getUserBasicInfoPathParamsSchema } from "./getUserBasicInfoSchema";
import { updateUserBasicInfoMutationRequestSchema, updateUserBasicInfoMutationResponseSchema, updateUserBasicInfoPathParamsSchema } from "./updateUserBasicInfoSchema";
import { getMyProfileQueryResponseSchema } from "./getMyProfileSchema";
import { updateMyProfileMutationRequestSchema, updateMyProfileMutationResponseSchema } from "./updateMyProfileSchema";
import { deleteMyProfileMutationResponseSchema } from "./deleteMyProfileSchema";
import { getMyNonCompulsoryHealthInsuranceQueryResponseSchema } from "./getMyNonCompulsoryHealthInsuranceSchema";
import { updateMyNonCompulsoryHealthInsuranceMutationRequestSchema, updateMyNonCompulsoryHealthInsuranceMutationResponseSchema } from "./updateMyNonCompulsoryHealthInsuranceSchema";
import { deleteMyNonCompulsoryHealthInsuranceMutationResponseSchema } from "./deleteMyNonCompulsoryHealthInsuranceSchema";
import { getMyNationalHealthInsuranceQueryResponseSchema } from "./getMyNationalHealthInsuranceSchema";
import { updateMyNationalHealthInsuranceMutationRequestSchema, updateMyNationalHealthInsuranceMutationResponseSchema } from "./updateMyNationalHealthInsuranceSchema";
import { deleteMyNationalHealthInsuranceMutationResponseSchema } from "./deleteMyNationalHealthInsuranceSchema";
import { getMyCompanyInfoQueryResponseSchema } from "./getMyCompanyInfoSchema";
import { updateMyCompanyInfoMutationRequestSchema, updateMyCompanyInfoMutationResponseSchema } from "./updateMyCompanyInfoSchema";
import { deleteMyCompanyInfoMutationResponseSchema } from "./deleteMyCompanyInfoSchema";
import { getMyBasicInfoQueryResponseSchema } from "./getMyBasicInfoSchema";
import { updateMyBasicInfoMutationRequestSchema, updateMyBasicInfoMutationResponseSchema } from "./updateMyBasicInfoSchema";
import { getDoctorPermissionsQueryResponseSchema, getDoctorPermissionsPathParamsSchema } from "./getDoctorPermissionsSchema";
import { setDoctorPermissionsMutationRequestSchema, setDoctorPermissionsMutationResponseSchema, setDoctorPermissionsPathParamsSchema } from "./setDoctorPermissionsSchema";
import { getAdminPermissionsQueryResponseSchema, getAdminPermissionsPathParamsSchema } from "./getAdminPermissionsSchema";
import { setAdminPermissionsMutationRequestSchema, setAdminPermissionsMutationResponseSchema, setAdminPermissionsPathParamsSchema } from "./setAdminPermissionsSchema";
import { getExerciseByIdQueryResponseSchema, getExerciseByIdPathParamsSchema } from "./getExerciseByIdSchema";
import { updateExerciseMutationRequestSchema, updateExerciseMutationResponseSchema, updateExercisePathParamsSchema } from "./updateExerciseSchema";
import { deleteExerciseMutationResponseSchema, deleteExercisePathParamsSchema } from "./deleteExerciseSchema";
import { getCategoryByIdQueryResponseSchema, getCategoryByIdPathParamsSchema } from "./getCategoryByIdSchema";
import { updateCategoryMutationRequestSchema, updateCategoryMutationResponseSchema, updateCategoryPathParamsSchema } from "./updateCategorySchema";
import { deleteCategoryMutationResponseSchema, deleteCategoryPathParamsSchema } from "./deleteCategorySchema";
import { getCategoryById1QueryResponseSchema, getCategoryById1PathParamsSchema } from "./getCategoryById1Schema";
import { updateCategory1MutationRequestSchema, updateCategory1MutationResponseSchema, updateCategory1PathParamsSchema } from "./updateCategory1Schema";
import { deleteCategory1MutationResponseSchema, deleteCategory1PathParamsSchema } from "./deleteCategory1Schema";
import { buyCourseMutationResponseSchema, buyCoursePathParamsSchema } from "./buyCourseSchema";
import { assignPermissionToDoctorMutationRequestSchema, assignPermissionToDoctorMutationResponseSchema, assignPermissionToDoctorPathParamsSchema } from "./assignPermissionToDoctorSchema";
import { assignPermissionToAdminMutationRequestSchema, assignPermissionToAdminMutationResponseSchema, assignPermissionToAdminPathParamsSchema } from "./assignPermissionToAdminSchema";
import { uploadVideoMutationRequestSchema, uploadVideoMutationResponseSchema } from "./uploadVideoSchema";
import { uploadImageMutationRequestSchema, uploadImageMutationResponseSchema } from "./uploadImageSchema";
import { generatePresignedUploadUrlMutationRequestSchema, generatePresignedUploadUrlMutationResponseSchema } from "./generatePresignedUploadUrlSchema";
import { createExerciseMutationRequestSchema, createExerciseMutationResponseSchema } from "./createExerciseSchema";
import { getAllCategoriesQueryResponseSchema } from "./getAllCategoriesSchema";
import { createCategoryMutationRequestSchema, createCategoryMutationResponseSchema } from "./createCategorySchema";
import { getAllCoursesQueryResponseSchema } from "./getAllCoursesSchema";
import { createCourseMutationRequestSchema, createCourseMutationResponseSchema } from "./createCourseSchema";
import { getAllCategories1QueryResponseSchema } from "./getAllCategories1Schema";
import { createCategory1MutationRequestSchema, createCategory1MutationResponseSchema } from "./createCategory1Schema";
import { addBalanceToUserMutationRequestSchema, addBalanceToUserMutationResponseSchema, addBalanceToUserPathParamsSchema } from "./addBalanceToUserSchema";
import { addBalanceMutationRequestSchema, addBalanceMutationResponseSchema } from "./addBalanceSchema";
import { verifyOtpAndLoginMutationRequestSchema, verifyOtpAndLoginMutationResponseSchema } from "./verifyOtpAndLoginSchema";
import { sendOtpForUserMutationRequestSchema, sendOtpForUserMutationResponseSchema } from "./sendOtpForUserSchema";
import { staffLoginMutationRequestSchema, staffLoginMutationResponseSchema } from "./staffLoginSchema";
import { refreshTokenMutationRequestSchema, refreshTokenMutationResponseSchema } from "./refreshTokenSchema";
import { logoutMutationRequestSchema, logoutMutationResponseSchema } from "./logoutSchema";
import { getAllUsersQueryResponseSchema } from "./getAllUsersSchema";
import { getCurrentUserQueryResponseSchema } from "./getCurrentUserSchema";
import { getMyPurchasesQueryResponseSchema } from "./getMyPurchasesSchema";
import { getMyPurchasesPaginatedQueryResponseSchema, getMyPurchasesPaginatedQueryParamsSchema } from "./getMyPurchasesPaginatedSchema";
import { checkCourseOwnershipQueryResponseSchema, checkCourseOwnershipPathParamsSchema } from "./checkCourseOwnershipSchema";
import { getAllPermissionsQueryResponseSchema } from "./getAllPermissionsSchema";
import { generateVideoViewingUrlQueryResponseSchema, generateVideoViewingUrlQueryParamsSchema } from "./generateVideoViewingUrlSchema";
import { generatePresignedAccessUrlQueryResponseSchema, generatePresignedAccessUrlPathParamsSchema, generatePresignedAccessUrlQueryParamsSchema } from "./generatePresignedAccessUrlSchema";
import { getAllExercisesPaginatedQueryResponseSchema, getAllExercisesPaginatedQueryParamsSchema } from "./getAllExercisesPaginatedSchema";
import { getCategoriesByTypeQueryResponseSchema, getCategoriesByTypePathParamsSchema } from "./getCategoriesByTypeSchema";
import { getCategoriesByTypePaginatedQueryResponseSchema, getCategoriesByTypePaginatedPathParamsSchema, getCategoriesByTypePaginatedQueryParamsSchema } from "./getCategoriesByTypePaginatedSchema";
import { searchCategoriesQueryResponseSchema, searchCategoriesQueryParamsSchema } from "./searchCategoriesSchema";
import { searchCategoriesPaginatedQueryResponseSchema, searchCategoriesPaginatedQueryParamsSchema } from "./searchCategoriesPaginatedSchema";
import { getAllCategoriesPaginatedQueryResponseSchema, getAllCategoriesPaginatedQueryParamsSchema } from "./getAllCategoriesPaginatedSchema";
import { getCourseByIdQueryResponseSchema, getCourseByIdPathParamsSchema } from "./getCourseByIdSchema";
import { searchCoursesQueryResponseSchema, searchCoursesQueryParamsSchema } from "./searchCoursesSchema";
import { getAllCoursesPaginatedQueryResponseSchema, getAllCoursesPaginatedQueryParamsSchema } from "./getAllCoursesPaginatedSchema";
import { getCoursesByCategoryQueryResponseSchema, getCoursesByCategoryPathParamsSchema } from "./getCoursesByCategorySchema";
import { getCategoriesByType1QueryResponseSchema, getCategoriesByType1PathParamsSchema } from "./getCategoriesByType1Schema";
import { getCategoriesByTypePaginated1QueryResponseSchema, getCategoriesByTypePaginated1PathParamsSchema, getCategoriesByTypePaginated1QueryParamsSchema } from "./getCategoriesByTypePaginated1Schema";
import { searchCategories1QueryResponseSchema, searchCategories1QueryParamsSchema } from "./searchCategories1Schema";
import { searchCategoriesPaginated1QueryResponseSchema, searchCategoriesPaginated1QueryParamsSchema } from "./searchCategoriesPaginated1Schema";
import { getAllCategoriesPaginated1QueryResponseSchema, getAllCategoriesPaginated1QueryParamsSchema } from "./getAllCategoriesPaginated1Schema";
import { getUserBalanceQueryResponseSchema } from "./getUserBalanceSchema";
import { getTransactionHistoryQueryResponseSchema } from "./getTransactionHistorySchema";
import { getAllUsers1QueryResponseSchema, getAllUsers1QueryParamsSchema } from "./getAllUsers1Schema";
import { removePermissionFromDoctorMutationRequestSchema, removePermissionFromDoctorMutationResponseSchema, removePermissionFromDoctorPathParamsSchema } from "./removePermissionFromDoctorSchema";
import { removePermissionFromAdminMutationRequestSchema, removePermissionFromAdminMutationResponseSchema, removePermissionFromAdminPathParamsSchema } from "./removePermissionFromAdminSchema";
import { deleteFileMutationResponseSchema, deleteFileQueryParamsSchema } from "./deleteFileSchema";

 export const operations = { "getUserProfile": {
        request: undefined,
        parameters: {
            path: getUserProfilePathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getUserProfileQueryResponseSchema,
            default: getUserProfileQueryResponseSchema
        },
        errors: {}
    }, "updateUserProfile": {
        request: updateUserProfileMutationRequestSchema,
        parameters: {
            path: updateUserProfilePathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: updateUserProfileMutationResponseSchema,
            default: updateUserProfileMutationResponseSchema
        },
        errors: {}
    }, "deleteUserProfile": {
        request: undefined,
        parameters: {
            path: deleteUserProfilePathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: deleteUserProfileMutationResponseSchema,
            default: deleteUserProfileMutationResponseSchema
        },
        errors: {}
    }, "getNonCompulsoryHealthInsurance": {
        request: undefined,
        parameters: {
            path: getNonCompulsoryHealthInsurancePathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getNonCompulsoryHealthInsuranceQueryResponseSchema,
            default: getNonCompulsoryHealthInsuranceQueryResponseSchema
        },
        errors: {}
    }, "updateNonCompulsoryHealthInsurance": {
        request: updateNonCompulsoryHealthInsuranceMutationRequestSchema,
        parameters: {
            path: updateNonCompulsoryHealthInsurancePathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: updateNonCompulsoryHealthInsuranceMutationResponseSchema,
            default: updateNonCompulsoryHealthInsuranceMutationResponseSchema
        },
        errors: {}
    }, "deleteNonCompulsoryHealthInsurance": {
        request: undefined,
        parameters: {
            path: deleteNonCompulsoryHealthInsurancePathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: deleteNonCompulsoryHealthInsuranceMutationResponseSchema,
            default: deleteNonCompulsoryHealthInsuranceMutationResponseSchema
        },
        errors: {}
    }, "getNationalHealthInsurance": {
        request: undefined,
        parameters: {
            path: getNationalHealthInsurancePathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getNationalHealthInsuranceQueryResponseSchema,
            default: getNationalHealthInsuranceQueryResponseSchema
        },
        errors: {}
    }, "updateNationalHealthInsurance": {
        request: updateNationalHealthInsuranceMutationRequestSchema,
        parameters: {
            path: updateNationalHealthInsurancePathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: updateNationalHealthInsuranceMutationResponseSchema,
            default: updateNationalHealthInsuranceMutationResponseSchema
        },
        errors: {}
    }, "deleteNationalHealthInsurance": {
        request: undefined,
        parameters: {
            path: deleteNationalHealthInsurancePathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: deleteNationalHealthInsuranceMutationResponseSchema,
            default: deleteNationalHealthInsuranceMutationResponseSchema
        },
        errors: {}
    }, "getUserCompanyInfo": {
        request: undefined,
        parameters: {
            path: getUserCompanyInfoPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getUserCompanyInfoQueryResponseSchema,
            default: getUserCompanyInfoQueryResponseSchema
        },
        errors: {}
    }, "updateUserCompanyInfo": {
        request: updateUserCompanyInfoMutationRequestSchema,
        parameters: {
            path: updateUserCompanyInfoPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: updateUserCompanyInfoMutationResponseSchema,
            default: updateUserCompanyInfoMutationResponseSchema
        },
        errors: {}
    }, "deleteUserCompanyInfo": {
        request: undefined,
        parameters: {
            path: deleteUserCompanyInfoPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: deleteUserCompanyInfoMutationResponseSchema,
            default: deleteUserCompanyInfoMutationResponseSchema
        },
        errors: {}
    }, "getUserBasicInfo": {
        request: undefined,
        parameters: {
            path: getUserBasicInfoPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getUserBasicInfoQueryResponseSchema,
            default: getUserBasicInfoQueryResponseSchema
        },
        errors: {}
    }, "updateUserBasicInfo": {
        request: updateUserBasicInfoMutationRequestSchema,
        parameters: {
            path: updateUserBasicInfoPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: updateUserBasicInfoMutationResponseSchema,
            default: updateUserBasicInfoMutationResponseSchema
        },
        errors: {}
    }, "getMyProfile": {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getMyProfileQueryResponseSchema,
            default: getMyProfileQueryResponseSchema
        },
        errors: {}
    }, "updateMyProfile": {
        request: updateMyProfileMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: updateMyProfileMutationResponseSchema,
            default: updateMyProfileMutationResponseSchema
        },
        errors: {}
    }, "deleteMyProfile": {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: deleteMyProfileMutationResponseSchema,
            default: deleteMyProfileMutationResponseSchema
        },
        errors: {}
    }, "getMyNonCompulsoryHealthInsurance": {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getMyNonCompulsoryHealthInsuranceQueryResponseSchema,
            default: getMyNonCompulsoryHealthInsuranceQueryResponseSchema
        },
        errors: {}
    }, "updateMyNonCompulsoryHealthInsurance": {
        request: updateMyNonCompulsoryHealthInsuranceMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: updateMyNonCompulsoryHealthInsuranceMutationResponseSchema,
            default: updateMyNonCompulsoryHealthInsuranceMutationResponseSchema
        },
        errors: {}
    }, "deleteMyNonCompulsoryHealthInsurance": {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: deleteMyNonCompulsoryHealthInsuranceMutationResponseSchema,
            default: deleteMyNonCompulsoryHealthInsuranceMutationResponseSchema
        },
        errors: {}
    }, "getMyNationalHealthInsurance": {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getMyNationalHealthInsuranceQueryResponseSchema,
            default: getMyNationalHealthInsuranceQueryResponseSchema
        },
        errors: {}
    }, "updateMyNationalHealthInsurance": {
        request: updateMyNationalHealthInsuranceMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: updateMyNationalHealthInsuranceMutationResponseSchema,
            default: updateMyNationalHealthInsuranceMutationResponseSchema
        },
        errors: {}
    }, "deleteMyNationalHealthInsurance": {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: deleteMyNationalHealthInsuranceMutationResponseSchema,
            default: deleteMyNationalHealthInsuranceMutationResponseSchema
        },
        errors: {}
    }, "getMyCompanyInfo": {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getMyCompanyInfoQueryResponseSchema,
            default: getMyCompanyInfoQueryResponseSchema
        },
        errors: {}
    }, "updateMyCompanyInfo": {
        request: updateMyCompanyInfoMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: updateMyCompanyInfoMutationResponseSchema,
            default: updateMyCompanyInfoMutationResponseSchema
        },
        errors: {}
    }, "deleteMyCompanyInfo": {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: deleteMyCompanyInfoMutationResponseSchema,
            default: deleteMyCompanyInfoMutationResponseSchema
        },
        errors: {}
    }, "getMyBasicInfo": {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getMyBasicInfoQueryResponseSchema,
            default: getMyBasicInfoQueryResponseSchema
        },
        errors: {}
    }, "updateMyBasicInfo": {
        request: updateMyBasicInfoMutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: updateMyBasicInfoMutationResponseSchema,
            default: updateMyBasicInfoMutationResponseSchema
        },
        errors: {}
    }, "getDoctorPermissions": {
        request: undefined,
        parameters: {
            path: getDoctorPermissionsPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getDoctorPermissionsQueryResponseSchema,
            default: getDoctorPermissionsQueryResponseSchema
        },
        errors: {}
    }, "setDoctorPermissions": {
        request: setDoctorPermissionsMutationRequestSchema,
        parameters: {
            path: setDoctorPermissionsPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: setDoctorPermissionsMutationResponseSchema,
            default: setDoctorPermissionsMutationResponseSchema
        },
        errors: {}
    }, "getAdminPermissions": {
        request: undefined,
        parameters: {
            path: getAdminPermissionsPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getAdminPermissionsQueryResponseSchema,
            default: getAdminPermissionsQueryResponseSchema
        },
        errors: {}
    }, "setAdminPermissions": {
        request: setAdminPermissionsMutationRequestSchema,
        parameters: {
            path: setAdminPermissionsPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: setAdminPermissionsMutationResponseSchema,
            default: setAdminPermissionsMutationResponseSchema
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
    }, "getCategoryById_1": {
        request: undefined,
        parameters: {
            path: getCategoryById1PathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getCategoryById1QueryResponseSchema,
            default: getCategoryById1QueryResponseSchema
        },
        errors: {}
    }, "updateCategory_1": {
        request: updateCategory1MutationRequestSchema,
        parameters: {
            path: updateCategory1PathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: updateCategory1MutationResponseSchema,
            default: updateCategory1MutationResponseSchema
        },
        errors: {}
    }, "deleteCategory_1": {
        request: undefined,
        parameters: {
            path: deleteCategory1PathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: deleteCategory1MutationResponseSchema,
            default: deleteCategory1MutationResponseSchema
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
    }, "assignPermissionToDoctor": {
        request: assignPermissionToDoctorMutationRequestSchema,
        parameters: {
            path: assignPermissionToDoctorPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: assignPermissionToDoctorMutationResponseSchema,
            default: assignPermissionToDoctorMutationResponseSchema
        },
        errors: {}
    }, "assignPermissionToAdmin": {
        request: assignPermissionToAdminMutationRequestSchema,
        parameters: {
            path: assignPermissionToAdminPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: assignPermissionToAdminMutationResponseSchema,
            default: assignPermissionToAdminMutationResponseSchema
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
    }, "getAllCategories_1": {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getAllCategories1QueryResponseSchema,
            default: getAllCategories1QueryResponseSchema
        },
        errors: {}
    }, "createCategory_1": {
        request: createCategory1MutationRequestSchema,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: createCategory1MutationResponseSchema,
            default: createCategory1MutationResponseSchema
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
    }, "getCurrentUser": {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getCurrentUserQueryResponseSchema,
            default: getCurrentUserQueryResponseSchema
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
    }, "getAllPermissions": {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getAllPermissionsQueryResponseSchema,
            default: getAllPermissionsQueryResponseSchema
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
    }, "getCategoriesByType_1": {
        request: undefined,
        parameters: {
            path: getCategoriesByType1PathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: getCategoriesByType1QueryResponseSchema,
            default: getCategoriesByType1QueryResponseSchema
        },
        errors: {}
    }, "getCategoriesByTypePaginated_1": {
        request: undefined,
        parameters: {
            path: getCategoriesByTypePaginated1PathParamsSchema,
            query: getCategoriesByTypePaginated1QueryParamsSchema,
            header: undefined
        },
        responses: {
            200: getCategoriesByTypePaginated1QueryResponseSchema,
            default: getCategoriesByTypePaginated1QueryResponseSchema
        },
        errors: {}
    }, "searchCategories_1": {
        request: undefined,
        parameters: {
            path: undefined,
            query: searchCategories1QueryParamsSchema,
            header: undefined
        },
        responses: {
            200: searchCategories1QueryResponseSchema,
            default: searchCategories1QueryResponseSchema
        },
        errors: {}
    }, "searchCategoriesPaginated_1": {
        request: undefined,
        parameters: {
            path: undefined,
            query: searchCategoriesPaginated1QueryParamsSchema,
            header: undefined
        },
        responses: {
            200: searchCategoriesPaginated1QueryResponseSchema,
            default: searchCategoriesPaginated1QueryResponseSchema
        },
        errors: {}
    }, "getAllCategoriesPaginated_1": {
        request: undefined,
        parameters: {
            path: undefined,
            query: getAllCategoriesPaginated1QueryParamsSchema,
            header: undefined
        },
        responses: {
            200: getAllCategoriesPaginated1QueryResponseSchema,
            default: getAllCategoriesPaginated1QueryResponseSchema
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
            query: getAllUsers1QueryParamsSchema,
            header: undefined
        },
        responses: {
            200: getAllUsers1QueryResponseSchema,
            default: getAllUsers1QueryResponseSchema
        },
        errors: {}
    }, "removePermissionFromDoctor": {
        request: removePermissionFromDoctorMutationRequestSchema,
        parameters: {
            path: removePermissionFromDoctorPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: removePermissionFromDoctorMutationResponseSchema,
            default: removePermissionFromDoctorMutationResponseSchema
        },
        errors: {}
    }, "removePermissionFromAdmin": {
        request: removePermissionFromAdminMutationRequestSchema,
        parameters: {
            path: removePermissionFromAdminPathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: removePermissionFromAdminMutationResponseSchema,
            default: removePermissionFromAdminMutationResponseSchema
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
export const paths = { "/api/users/{userId}/profile": {
        get: operations["getUserProfile"],
        put: operations["updateUserProfile"],
        delete: operations["deleteUserProfile"]
    }, "/api/users/{userId}/non-compulsory-health-insurance": {
        get: operations["getNonCompulsoryHealthInsurance"],
        put: operations["updateNonCompulsoryHealthInsurance"],
        delete: operations["deleteNonCompulsoryHealthInsurance"]
    }, "/api/users/{userId}/national-health-insurance": {
        get: operations["getNationalHealthInsurance"],
        put: operations["updateNationalHealthInsurance"],
        delete: operations["deleteNationalHealthInsurance"]
    }, "/api/users/{userId}/company-info": {
        get: operations["getUserCompanyInfo"],
        put: operations["updateUserCompanyInfo"],
        delete: operations["deleteUserCompanyInfo"]
    }, "/api/users/{userId}/basic-info": {
        get: operations["getUserBasicInfo"],
        put: operations["updateUserBasicInfo"]
    }, "/api/users/me/profile": {
        get: operations["getMyProfile"],
        put: operations["updateMyProfile"],
        delete: operations["deleteMyProfile"]
    }, "/api/users/me/non-compulsory-health-insurance": {
        get: operations["getMyNonCompulsoryHealthInsurance"],
        put: operations["updateMyNonCompulsoryHealthInsurance"],
        delete: operations["deleteMyNonCompulsoryHealthInsurance"]
    }, "/api/users/me/national-health-insurance": {
        get: operations["getMyNationalHealthInsurance"],
        put: operations["updateMyNationalHealthInsurance"],
        delete: operations["deleteMyNationalHealthInsurance"]
    }, "/api/users/me/company-info": {
        get: operations["getMyCompanyInfo"],
        put: operations["updateMyCompanyInfo"],
        delete: operations["deleteMyCompanyInfo"]
    }, "/api/users/me/basic-info": {
        get: operations["getMyBasicInfo"],
        put: operations["updateMyBasicInfo"]
    }, "/api/permissions/doctor/{doctorId}": {
        get: operations["getDoctorPermissions"],
        put: operations["setDoctorPermissions"]
    }, "/api/permissions/admin/{adminId}": {
        get: operations["getAdminPermissions"],
        put: operations["setAdminPermissions"]
    }, "/api/exercises/{id}": {
        get: operations["getExerciseById"],
        put: operations["updateExercise"],
        delete: operations["deleteExercise"]
    }, "/api/exercise-categories/{id}": {
        get: operations["getCategoryById"],
        put: operations["updateCategory"],
        delete: operations["deleteCategory"]
    }, "/api/course-categories/{id}": {
        get: operations["getCategoryById_1"],
        put: operations["updateCategory_1"],
        delete: operations["deleteCategory_1"]
    }, "/api/purchases/course/{courseId}": {
        post: operations["buyCourse"]
    }, "/api/permissions/doctor/{doctorId}/assign": {
        post: operations["assignPermissionToDoctor"]
    }, "/api/permissions/admin/{adminId}/assign": {
        post: operations["assignPermissionToAdmin"]
    }, "/api/files/upload/video": {
        post: operations["uploadVideo"]
    }, "/api/files/upload/image": {
        post: operations["uploadImage"]
    }, "/api/files/presigned-url": {
        post: operations["generatePresignedUploadUrl"]
    }, "/api/exercises": {
        post: operations["createExercise"]
    }, "/api/exercise-categories": {
        get: operations["getAllCategories"],
        post: operations["createCategory"]
    }, "/api/courses": {
        get: operations["getAllCourses"],
        post: operations["createCourse"]
    }, "/api/course-categories": {
        get: operations["getAllCategories_1"],
        post: operations["createCategory_1"]
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
    }, "/api/users/me": {
        get: operations["getCurrentUser"]
    }, "/api/purchases": {
        get: operations["getMyPurchases"]
    }, "/api/purchases/paginated": {
        get: operations["getMyPurchasesPaginated"]
    }, "/api/purchases/check/course/{courseId}": {
        get: operations["checkCourseOwnership"]
    }, "/api/permissions": {
        get: operations["getAllPermissions"]
    }, "/api/files/view/video": {
        get: operations["generateVideoViewingUrl"]
    }, "/api/files/presigned-url/{folder}/{fileName}": {
        get: operations["generatePresignedAccessUrl"]
    }, "/api/exercises/paginated": {
        get: operations["getAllExercisesPaginated"]
    }, "/api/exercise-categories/type/{type}": {
        get: operations["getCategoriesByType"]
    }, "/api/exercise-categories/type/{type}/paginated": {
        get: operations["getCategoriesByTypePaginated"]
    }, "/api/exercise-categories/search": {
        get: operations["searchCategories"]
    }, "/api/exercise-categories/search/paginated": {
        get: operations["searchCategoriesPaginated"]
    }, "/api/exercise-categories/paginated": {
        get: operations["getAllCategoriesPaginated"]
    }, "/api/courses/{id}": {
        get: operations["getCourseById"]
    }, "/api/courses/search": {
        get: operations["searchCourses"]
    }, "/api/courses/paginated": {
        get: operations["getAllCoursesPaginated"]
    }, "/api/courses/category/{categoryId}": {
        get: operations["getCoursesByCategory"]
    }, "/api/course-categories/type/{type}": {
        get: operations["getCategoriesByType_1"]
    }, "/api/course-categories/type/{type}/paginated": {
        get: operations["getCategoriesByTypePaginated_1"]
    }, "/api/course-categories/search": {
        get: operations["searchCategories_1"]
    }, "/api/course-categories/search/paginated": {
        get: operations["searchCategoriesPaginated_1"]
    }, "/api/course-categories/paginated": {
        get: operations["getAllCategoriesPaginated_1"]
    }, "/api/balance": {
        get: operations["getUserBalance"]
    }, "/api/balance/transactions": {
        get: operations["getTransactionHistory"]
    }, "/api/admin/users": {
        get: operations["getAllUsers_1"]
    }, "/api/permissions/doctor/{doctorId}/remove": {
        delete: operations["removePermissionFromDoctor"]
    }, "/api/permissions/admin/{adminId}/remove": {
        delete: operations["removePermissionFromAdmin"]
    }, "/api/files/delete": {
        delete: operations["deleteFile"]
    } } as const;