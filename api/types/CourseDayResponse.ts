import type { DayExerciseResponse } from "./DayExerciseResponse";

 export type CourseDayResponse = {
    /**
     * @type integer | undefined, int64
    */
    id?: number;
    /**
     * @type integer | undefined, int32
    */
    dayNumber?: number;
    /**
     * @type string | undefined
    */
    dayDescription?: string;
    /**
     * @type boolean | undefined
    */
    isActive?: boolean;
    /**
     * @type array | undefined
    */
    dayExercises?: DayExerciseResponse[];
    /**
     * @type string | undefined, date-time
    */
    createdAt?: string;
    /**
     * @type string | undefined, date-time
    */
    updatedAt?: string;
};