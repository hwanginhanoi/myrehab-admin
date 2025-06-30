import type { Exercise } from "./Exercise";
import type { ExerciseCreateRequest } from "./ExerciseCreateRequest";

 /**
 * @description OK
*/
export type CreateExercise200 = Exercise;
export type CreateExerciseMutationRequest = ExerciseCreateRequest;
/**
 * @description OK
*/
export type CreateExerciseMutationResponse = Exercise;
export type CreateExerciseMutation = {
    Response: CreateExerciseMutationResponse;
    Request: CreateExerciseMutationRequest;
};