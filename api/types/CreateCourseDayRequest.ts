import type { CreateDayExerciseRequest } from "./CreateDayExerciseRequest";

 export type CreateCourseDayRequest = {
    /**
     * @type integer, int32
    */
    dayNumber: number;
    /**
     * @type string | undefined
    */
    dayDescription?: string;
    /**
     * @type array
    */
    dayExercises: CreateDayExerciseRequest[];
};