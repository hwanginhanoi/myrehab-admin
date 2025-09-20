import type { ExerciseResponse } from "./ExerciseResponse";

 /**
 * @description OK
*/
export type GetAllExercises200 = ExerciseResponse[];
/**
 * @description OK
*/
export type GetAllExercisesQueryResponse = ExerciseResponse[];
export type GetAllExercisesQuery = {
    Response: GetAllExercisesQueryResponse;
};