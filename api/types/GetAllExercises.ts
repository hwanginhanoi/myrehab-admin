import type { ExerciseDto } from "./ExerciseDto";

 /**
 * @description OK
*/
export type GetAllExercises200 = ExerciseDto[];
/**
 * @description OK
*/
export type GetAllExercisesQueryResponse = ExerciseDto[];
export type GetAllExercisesQuery = {
    Response: GetAllExercisesQueryResponse;
};