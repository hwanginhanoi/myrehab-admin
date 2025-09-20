import type { ExerciseResponse } from "./ExerciseResponse";

 export type GetExerciseByIdPathParams = {
    /**
     * @type integer, int64
    */
    id: number;
};
/**
 * @description OK
*/
export type GetExerciseById200 = ExerciseResponse;
/**
 * @description OK
*/
export type GetExerciseByIdQueryResponse = ExerciseResponse;
export type GetExerciseByIdQuery = {
    Response: GetExerciseByIdQueryResponse;
    PathParams: GetExerciseByIdPathParams;
};