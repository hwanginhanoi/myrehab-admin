export type RemoveExerciseFromCoursePathParams = {
    /**
     * @type integer, int64
    */
    courseId: number;
    /**
     * @type integer, int64
    */
    exerciseId: number;
};
/**
 * @description OK
*/
export type RemoveExerciseFromCourse200 = any;
export type RemoveExerciseFromCourseMutationResponse = any;
export type RemoveExerciseFromCourseMutation = {
    Response: RemoveExerciseFromCourseMutationResponse;
    PathParams: RemoveExerciseFromCoursePathParams;
};