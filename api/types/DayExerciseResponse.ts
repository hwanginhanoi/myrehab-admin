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
     * @type integer | undefined, int32
    */
    customRepetitions?: number;
    /**
     * @type integer | undefined, int32
    */
    customSets?: number;
    /**
     * @type integer | undefined, int32
    */
    customDurationMinutes?: number;
    /**
     * @type string | undefined
    */
    notes?: string;
    /**
     * @type boolean | undefined
    */
    isActive?: boolean;
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