import type { ExerciseResponse } from "./ExerciseResponse";

 export type SearchExercisesQueryParams = {
    /**
     * @description Search keyword
     * @type string
    */
    keyword: string;
};
/**
 * @description OK
*/
export type SearchExercises200 = ExerciseResponse[];
/**
 * @description OK
*/
export type SearchExercisesQueryResponse = ExerciseResponse[];
export type SearchExercisesQuery = {
    Response: SearchExercisesQueryResponse;
    QueryParams: SearchExercisesQueryParams;
};