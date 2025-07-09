export type AddExerciseToCoursePathParams = {
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
export type AddExerciseToCourse200 = any;
export type AddExerciseToCourseMutationResponse = any;
export type AddExerciseToCourseMutation = {
    Response: AddExerciseToCourseMutationResponse;
    PathParams: AddExerciseToCoursePathParams;
};