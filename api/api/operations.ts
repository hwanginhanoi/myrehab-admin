export const operations = {
    "getUserProfile": {
        "path": "/api/users/:userId/profile",
        "method": "get"
    },
    "updateUserProfile": {
        "path": "/api/users/:userId/profile",
        "method": "put"
    },
    "deleteUserProfile": {
        "path": "/api/users/:userId/profile",
        "method": "delete"
    },
    "getNonCompulsoryHealthInsurance": {
        "path": "/api/users/:userId/non-compulsory-health-insurance",
        "method": "get"
    },
    "updateNonCompulsoryHealthInsurance": {
        "path": "/api/users/:userId/non-compulsory-health-insurance",
        "method": "put"
    },
    "deleteNonCompulsoryHealthInsurance": {
        "path": "/api/users/:userId/non-compulsory-health-insurance",
        "method": "delete"
    },
    "getNationalHealthInsurance": {
        "path": "/api/users/:userId/national-health-insurance",
        "method": "get"
    },
    "updateNationalHealthInsurance": {
        "path": "/api/users/:userId/national-health-insurance",
        "method": "put"
    },
    "deleteNationalHealthInsurance": {
        "path": "/api/users/:userId/national-health-insurance",
        "method": "delete"
    },
    "getUserCompanyInfo": {
        "path": "/api/users/:userId/company-info",
        "method": "get"
    },
    "updateUserCompanyInfo": {
        "path": "/api/users/:userId/company-info",
        "method": "put"
    },
    "deleteUserCompanyInfo": {
        "path": "/api/users/:userId/company-info",
        "method": "delete"
    },
    "getUserBasicInfo": {
        "path": "/api/users/:userId/basic-info",
        "method": "get"
    },
    "updateUserBasicInfo": {
        "path": "/api/users/:userId/basic-info",
        "method": "put"
    },
    "getMyBasicInfo": {
        "path": "/api/users/me/basic-info",
        "method": "get"
    },
    "updateMyBasicInfo": {
        "path": "/api/users/me/basic-info",
        "method": "put"
    },
    "getMyProfile": {
        "path": "/api/users/api/users/me/profile",
        "method": "get"
    },
    "updateMyProfile": {
        "path": "/api/users/api/users/me/profile",
        "method": "put"
    },
    "deleteMyProfile": {
        "path": "/api/users/api/users/me/profile",
        "method": "delete"
    },
    "getMyNonCompulsoryHealthInsurance": {
        "path": "/api/users/api/users/me/non-compulsory-health-insurance",
        "method": "get"
    },
    "updateMyNonCompulsoryHealthInsurance": {
        "path": "/api/users/api/users/me/non-compulsory-health-insurance",
        "method": "put"
    },
    "deleteMyNonCompulsoryHealthInsurance": {
        "path": "/api/users/api/users/me/non-compulsory-health-insurance",
        "method": "delete"
    },
    "getMyNationalHealthInsurance": {
        "path": "/api/users/api/users/me/national-health-insurance",
        "method": "get"
    },
    "updateMyNationalHealthInsurance": {
        "path": "/api/users/api/users/me/national-health-insurance",
        "method": "put"
    },
    "deleteMyNationalHealthInsurance": {
        "path": "/api/users/api/users/me/national-health-insurance",
        "method": "delete"
    },
    "getMyCompanyInfo": {
        "path": "/api/users/api/users/me/company-info",
        "method": "get"
    },
    "updateMyCompanyInfo": {
        "path": "/api/users/api/users/me/company-info",
        "method": "put"
    },
    "deleteMyCompanyInfo": {
        "path": "/api/users/api/users/me/company-info",
        "method": "delete"
    },
    "getExerciseById": {
        "path": "/api/exercises/:id",
        "method": "get"
    },
    "updateExercise": {
        "path": "/api/exercises/:id",
        "method": "put"
    },
    "deleteExercise": {
        "path": "/api/exercises/:id",
        "method": "delete"
    },
    "getCategoryById": {
        "path": "/api/exercise-categories/:id",
        "method": "get"
    },
    "updateCategory": {
        "path": "/api/exercise-categories/:id",
        "method": "put"
    },
    "deleteCategory": {
        "path": "/api/exercise-categories/:id",
        "method": "delete"
    },
    "getCategoryById_1": {
        "path": "/api/course-categories/:id",
        "method": "get"
    },
    "updateCategory_1": {
        "path": "/api/course-categories/:id",
        "method": "put"
    },
    "deleteCategory_1": {
        "path": "/api/course-categories/:id",
        "method": "delete"
    },
    "buyCourse": {
        "path": "/api/purchases/course/:courseId",
        "method": "post"
    },
    "uploadVideo": {
        "path": "/api/files/upload/video",
        "method": "post"
    },
    "uploadImage": {
        "path": "/api/files/upload/image",
        "method": "post"
    },
    "generatePresignedUploadUrl": {
        "path": "/api/files/presigned-url",
        "method": "post"
    },
    "createExercise": {
        "path": "/api/exercises",
        "method": "post"
    },
    "getAllCategories": {
        "path": "/api/exercise-categories",
        "method": "get"
    },
    "createCategory": {
        "path": "/api/exercise-categories",
        "method": "post"
    },
    "getAllCourses": {
        "path": "/api/courses",
        "method": "get"
    },
    "createCourse": {
        "path": "/api/courses",
        "method": "post"
    },
    "getAllCategories_1": {
        "path": "/api/course-categories",
        "method": "get"
    },
    "createCategory_1": {
        "path": "/api/course-categories",
        "method": "post"
    },
    "addBalanceToUser": {
        "path": "/api/balance/admin/add/:userId",
        "method": "post"
    },
    "addBalance": {
        "path": "/api/balance/add",
        "method": "post"
    },
    "verifyOtpAndLogin": {
        "path": "/api/auth/user/verify-otp",
        "method": "post"
    },
    "sendOtpForUser": {
        "path": "/api/auth/user/send-otp",
        "method": "post"
    },
    "staffLogin": {
        "path": "/api/auth/staff/login",
        "method": "post"
    },
    "refreshToken": {
        "path": "/api/auth/refresh-token",
        "method": "post"
    },
    "logout": {
        "path": "/api/auth/logout",
        "method": "post"
    },
    "getAllUsers": {
        "path": "/api/users",
        "method": "get"
    },
    "getMyPurchases": {
        "path": "/api/purchases",
        "method": "get"
    },
    "getMyPurchasesPaginated": {
        "path": "/api/purchases/paginated",
        "method": "get"
    },
    "checkCourseOwnership": {
        "path": "/api/purchases/check/course/:courseId",
        "method": "get"
    },
    "generateVideoViewingUrl": {
        "path": "/api/files/view/video",
        "method": "get"
    },
    "generatePresignedAccessUrl": {
        "path": "/api/files/presigned-url/:folder/:fileName",
        "method": "get"
    },
    "getAllExercisesPaginated": {
        "path": "/api/exercises/paginated",
        "method": "get"
    },
    "getCategoriesByType": {
        "path": "/api/exercise-categories/type/:type",
        "method": "get"
    },
    "getCategoriesByTypePaginated": {
        "path": "/api/exercise-categories/type/:type/paginated",
        "method": "get"
    },
    "searchCategories": {
        "path": "/api/exercise-categories/search",
        "method": "get"
    },
    "searchCategoriesPaginated": {
        "path": "/api/exercise-categories/search/paginated",
        "method": "get"
    },
    "getAllCategoriesPaginated": {
        "path": "/api/exercise-categories/paginated",
        "method": "get"
    },
    "getCourseById": {
        "path": "/api/courses/:id",
        "method": "get"
    },
    "searchCourses": {
        "path": "/api/courses/search",
        "method": "get"
    },
    "getAllCoursesPaginated": {
        "path": "/api/courses/paginated",
        "method": "get"
    },
    "getCoursesByCategory": {
        "path": "/api/courses/category/:categoryId",
        "method": "get"
    },
    "getCategoriesByType_1": {
        "path": "/api/course-categories/type/:type",
        "method": "get"
    },
    "getCategoriesByTypePaginated_1": {
        "path": "/api/course-categories/type/:type/paginated",
        "method": "get"
    },
    "searchCategories_1": {
        "path": "/api/course-categories/search",
        "method": "get"
    },
    "searchCategoriesPaginated_1": {
        "path": "/api/course-categories/search/paginated",
        "method": "get"
    },
    "getAllCategoriesPaginated_1": {
        "path": "/api/course-categories/paginated",
        "method": "get"
    },
    "getUserBalance": {
        "path": "/api/balance",
        "method": "get"
    },
    "getTransactionHistory": {
        "path": "/api/balance/transactions",
        "method": "get"
    },
    "getAllUsers_1": {
        "path": "/api/admin/users",
        "method": "get"
    },
    "getAllUsersPaginated": {
        "path": "/api/admin/users/paginated",
        "method": "get"
    },
    "deleteFile": {
        "path": "/api/files/delete",
        "method": "delete"
    }
} as const;