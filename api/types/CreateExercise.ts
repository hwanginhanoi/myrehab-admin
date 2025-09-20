import type { ExerciseResponse } from "./ExerciseResponse";
import type { CreateExerciseRequest } from "./CreateExerciseRequest";

 /**
 * @description OK
*/
export type CreateExercise200 = ExerciseResponse;
export type CreateExerciseMutationRequest = CreateExerciseRequest;
/**
 * @description OK
*/
export type CreateExerciseMutationResponse = ExerciseResponse;
export type CreateExerciseMutation = {
    Response: CreateExerciseMutationResponse;
    Request: CreateExerciseMutationRequest;
};