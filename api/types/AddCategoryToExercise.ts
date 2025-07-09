export type AddCategoryToExercisePathParams = {
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
export type AddCategoryToExercise200 = any;
export type AddCategoryToExerciseMutationResponse = any;
export type AddCategoryToExerciseMutation = {
    Response: AddCategoryToExerciseMutationResponse;
    PathParams: AddCategoryToExercisePathParams;
};