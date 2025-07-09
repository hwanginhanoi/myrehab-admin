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
    "getCourseById": {
        "path": "/api/courses/:id",
        "method": "get"
    },
    "updateCourse": {
        "path": "/api/courses/:id",
        "method": "put"
    },
    "deleteCourse": {
        "path": "/api/courses/:id",
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
    "assignCourseToPatient": {
        "path": "/api/patients/:patientId/courses/:courseId/assign",
        "method": "post"
    },
    "removeCourseFromPatient": {
        "path": "/api/patients/:patientId/courses/:courseId/assign",
        "method": "delete"
    },
    "getAllExercises": {
        "path": "/api/exercises",
        "method": "get"
    },
    "createExercise": {
        "path": "/api/exercises",
        "method": "post"
    },
    "addCategoryToExercise": {
        "path": "/api/exercises/:exerciseId/categories/:categoryId",
        "method": "post"
    },
    "removeCategoryFromExercise": {
        "path": "/api/exercises/:exerciseId/categories/:categoryId",
        "method": "delete"
    },
    "getAllCourses": {
        "path": "/api/courses",
        "method": "get"
    },
    "createCourse": {
        "path": "/api/courses",
        "method": "post"
    },
    "addExerciseToCourse": {
        "path": "/api/courses/:courseId/exercises/:exerciseId",
        "method": "post"
    },
    "removeExerciseFromCourse": {
        "path": "/api/courses/:courseId/exercises/:exerciseId",
        "method": "delete"
    },
    "getAllCategories": {
        "path": "/api/categories",
        "method": "get"
    },
    "createCategory": {
        "path": "/api/categories",
        "method": "post"
    },
    "register": {
        "path": "/api/auth/register",
        "method": "post"
    },
    "login": {
        "path": "/api/auth/login",
        "method": "post"
    },
    "getAllPatients": {
        "path": "/api/patients",
        "method": "get"
    },
    "getPurchasedExercises": {
        "path": "/api/patients/:patientId/exercises/purchased",
        "method": "get"
    },
    "getPurchasedCourses": {
        "path": "/api/patients/:patientId/courses/purchased",
        "method": "get"
    },
    "getAssignedCourses": {
        "path": "/api/patients/:patientId/courses/assigned",
        "method": "get"
    },
    "getPatientById": {
        "path": "/api/patients/:id",
        "method": "get"
    },
    "searchExercises": {
        "path": "/api/exercises/search",
        "method": "get"
    },
    "getExercisesByCategory": {
        "path": "/api/exercises/category/:categoryId",
        "method": "get"
    },
    "searchCourses": {
        "path": "/api/courses/search",
        "method": "get"
    },
    "getCoursesByCategory": {
        "path": "/api/courses/category/:categoryId",
        "method": "get"
    },
    "getCategoriesByType": {
        "path": "/api/categories/type/:type",
        "method": "get"
    }
} as const;