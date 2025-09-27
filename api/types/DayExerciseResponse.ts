import type { ExerciseInfo } from "./ExerciseInfo";

 export type DayExerciseResponse = {
    /**
     * @type integer | undefined, int64
    */
    id?: number;
    /**
     * @type integer | undefined, int32
    */
    orderInDay?: number;
    /**
     * @type object | undefined
    */
    exercise?: ExerciseInfo;
    /**
     * @type string | undefined, date-time
    */
    createdAt?: string;
    /**
     * @type string | undefined, date-time
    */
    updatedAt?: string;
};