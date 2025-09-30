export const operations = {
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
        "path": "/api/categories/:id",
        "method": "get"
    },
    "updateCategory": {
        "path": "/api/categories/:id",
        "method": "put"
    },
    "deleteCategory": {
        "path": "/api/categories/:id",
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
    "getAllExercises": {
        "path": "/api/exercises",
        "method": "get"
    },
    "createExercise": {
        "path": "/api/exercises",
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
    "getAllCategories": {
        "path": "/api/categories",
        "method": "get"
    },
    "createCategory": {
        "path": "/api/categories",
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
    "searchExercises": {
        "path": "/api/exercises/search",
        "method": "get"
    },
    "getAllExercisesPaginated": {
        "path": "/api/exercises/paginated",
        "method": "get"
    },
    "getExercisesByCategory": {
        "path": "/api/exercises/category/:categoryId",
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
    "getCategoriesByType": {
        "path": "/api/categories/type/:type",
        "method": "get"
    },
    "getCategoriesByTypePaginated": {
        "path": "/api/categories/type/:type/paginated",
        "method": "get"
    },
    "searchCategories": {
        "path": "/api/categories/search",
        "method": "get"
    },
    "searchCategoriesPaginated": {
        "path": "/api/categories/search/paginated",
        "method": "get"
    },
    "getAllCategoriesPaginated": {
        "path": "/api/categories/paginated",
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