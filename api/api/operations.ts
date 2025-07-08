export const operations = {
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
    "getPatientById": {
        "path": "/api/admin/patients/:id",
        "method": "get"
    },
    "updatePatient": {
        "path": "/api/admin/patients/:id",
        "method": "put"
    },
    "deletePatient": {
        "path": "/api/admin/patients/:id",
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
    "register": {
        "path": "/api/auth/register",
        "method": "post"
    },
    "login": {
        "path": "/api/auth/login",
        "method": "post"
    },
    "getAllPatients": {
        "path": "/api/admin/patients",
        "method": "get"
    },
    "createPatient": {
        "path": "/api/admin/patients",
        "method": "post"
    },
    "assignCourseToPatient": {
        "path": "/api/admin/patients/:patientId/assign-course/:courseId",
        "method": "post"
    },
    "searchCoursesByTitle": {
        "path": "/api/courses/search",
        "method": "get"
    },
    "getCoursesByCategoryId": {
        "path": "/api/courses/category/:categoryId",
        "method": "get"
    },
    "searchPatients": {
        "path": "/api/admin/patients/search",
        "method": "get"
    },
    "removeCourseFromPatient": {
        "path": "/api/admin/patients/:patientId/remove-course/:courseId",
        "method": "delete"
    }
} as const;