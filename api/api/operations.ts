export const operations = {
    "register": {
        "path": "/api/auth/register",
        "method": "post"
    },
    "refreshToken": {
        "path": "/api/auth/refresh",
        "method": "post"
    },
    "authenticate": {
        "path": "/api/auth/login",
        "method": "post"
    },
    "getAllPlans": {
        "path": "/api/admin/plans",
        "method": "get"
    },
    "createPlan": {
        "path": "/api/admin/plans",
        "method": "post"
    },
    "getAllExercises": {
        "path": "/api/admin/exercises",
        "method": "get"
    },
    "createExercise": {
        "path": "/api/admin/exercises",
        "method": "post"
    },
    "getAllPlans_1": {
        "path": "/api/plans",
        "method": "get"
    },
    "getPlanById": {
        "path": "/api/plans/:id",
        "method": "get"
    },
    "getPlansByCategory": {
        "path": "/api/plans/category/:category",
        "method": "get"
    },
    "getPatientInfo": {
        "path": "/api/patients/:id",
        "method": "get"
    },
    "getPlanById_1": {
        "path": "/api/admin/plans/:id",
        "method": "get"
    },
    "getExerciseById": {
        "path": "/api/admin/exercises/:id",
        "method": "get"
    },
    "deleteExercise": {
        "path": "/api/admin/exercises/:id",
        "method": "delete"
    }
} as const;