import type { ExerciseDto } from "./ExerciseDto";

 export type SearchExercisesQueryParams = {
    /**
     * @type string
    */
    title: string;
};
/**
 * @description OK
*/
export type SearchExercises200 = ExerciseDto[];
/**
 * @description OK
*/
export type SearchExercisesQueryResponse = ExerciseDto[];
export type SearchExercisesQuery = {
    Response: SearchExercisesQueryResponse;
    QueryParams: SearchExercisesQueryParams;
};