import type { ExerciseDto } from "./ExerciseDto";

 export type GetExerciseByIdPathParams = {
    /**
     * @type integer, int64
    */
    id: number;
};
/**
 * @description OK
*/
export type GetExerciseById200 = ExerciseDto;
/**
 * @description OK
*/
export type GetExerciseByIdQueryResponse = ExerciseDto;
export type GetExerciseByIdQuery = {
    Response: GetExerciseByIdQueryResponse;
    PathParams: GetExerciseByIdPathParams;
};