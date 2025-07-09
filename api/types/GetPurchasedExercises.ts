import type { ExerciseDto } from "./ExerciseDto";

 export type GetPurchasedExercisesPathParams = {
    /**
     * @type integer, int64
    */
    patientId: number;
};
/**
 * @description OK
*/
export type GetPurchasedExercises200 = ExerciseDto[];
/**
 * @description OK
*/
export type GetPurchasedExercisesQueryResponse = ExerciseDto[];
export type GetPurchasedExercisesQuery = {
    Response: GetPurchasedExercisesQueryResponse;
    PathParams: GetPurchasedExercisesPathParams;
};