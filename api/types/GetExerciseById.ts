import type { Exercise } from "./Exercise";

 export type GetExerciseByIdPathParams = {
    /**
     * @type integer, int64
    */
    id: number;
};
/**
 * @description OK
*/
export type GetExerciseById200 = Exercise;
/**
 * @description OK
*/
export type GetExerciseByIdQueryResponse = Exercise;
export type GetExerciseByIdQuery = {
    Response: GetExerciseByIdQueryResponse;
    PathParams: GetExerciseByIdPathParams;
};