import type { ExerciseDto } from "./ExerciseDto";

 export type UpdateExercisePathParams = {
    /**
     * @type integer, int64
    */
    id: number;
};
/**
 * @description OK
*/
export type UpdateExercise200 = ExerciseDto;
export type UpdateExerciseMutationRequest = ExerciseDto;
/**
 * @description OK
*/
export type UpdateExerciseMutationResponse = ExerciseDto;
export type UpdateExerciseMutation = {
    Response: UpdateExerciseMutationResponse;
    Request: UpdateExerciseMutationRequest;
    PathParams: UpdateExercisePathParams;
};