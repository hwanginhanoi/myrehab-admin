import type { ExerciseDto } from "./ExerciseDto";

 export type GetExercisesByCategoryPathParams = {
    /**
     * @type integer, int64
    */
    categoryId: number;
};
/**
 * @description OK
*/
export type GetExercisesByCategory200 = ExerciseDto[];
/**
 * @description OK
*/
export type GetExercisesByCategoryQueryResponse = ExerciseDto[];
export type GetExercisesByCategoryQuery = {
    Response: GetExercisesByCategoryQueryResponse;
    PathParams: GetExercisesByCategoryPathParams;
};