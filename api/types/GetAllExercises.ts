import type { Exercise } from "./Exercise";

 /**
 * @description OK
*/
export type GetAllExercises200 = Exercise[];
/**
 * @description OK
*/
export type GetAllExercisesQueryResponse = Exercise[];
export type GetAllExercisesQuery = {
    Response: GetAllExercisesQueryResponse;
};