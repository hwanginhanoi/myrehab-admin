export type RemoveCategoryFromExercisePathParams = {
    /**
     * @type integer, int64
    */
    exerciseId: number;
    /**
     * @type integer, int64
    */
    categoryId: number;
};
/**
 * @description OK
*/
export type RemoveCategoryFromExercise200 = any;
export type RemoveCategoryFromExerciseMutationResponse = any;
export type RemoveCategoryFromExerciseMutation = {
    Response: RemoveCategoryFromExerciseMutationResponse;
    PathParams: RemoveCategoryFromExercisePathParams;
};