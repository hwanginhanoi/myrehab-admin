import type { ExerciseResponse } from "./ExerciseResponse";
import type { UpdateExerciseRequest } from "./UpdateExerciseRequest";

 export type UpdateExercisePathParams = {
    /**
     * @type integer, int64
    */
    id: number;
};
/**
 * @description OK
*/
export type UpdateExercise200 = ExerciseResponse;
export type UpdateExerciseMutationRequest = UpdateExerciseRequest;
/**
 * @description OK
*/
export type UpdateExerciseMutationResponse = ExerciseResponse;
export type UpdateExerciseMutation = {
    Response: UpdateExerciseMutationResponse;
    Request: UpdateExerciseMutationRequest;
    PathParams: UpdateExercisePathParams;
};