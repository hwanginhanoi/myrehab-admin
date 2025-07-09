import type { ExerciseDto } from "./ExerciseDto";

 /**
 * @description OK
*/
export type CreateExercise200 = ExerciseDto;
export type CreateExerciseMutationRequest = ExerciseDto;
/**
 * @description OK
*/
export type CreateExerciseMutationResponse = ExerciseDto;
export type CreateExerciseMutation = {
    Response: CreateExerciseMutationResponse;
    Request: CreateExerciseMutationRequest;
};