import type { ExerciseResponse } from "./ExerciseResponse";

 export type GetExercisesByCategoryPathParams = {
    /**
     * @type integer, int64
    */
    categoryId: number;
};
/**
 * @description OK
*/
export type GetExercisesByCategory200 = ExerciseResponse[];
/**
 * @description OK
*/
export type GetExercisesByCategoryQueryResponse = ExerciseResponse[];
export type GetExercisesByCategoryQuery = {
    Response: GetExercisesByCategoryQueryResponse;
    PathParams: GetExercisesByCategoryPathParams;
};