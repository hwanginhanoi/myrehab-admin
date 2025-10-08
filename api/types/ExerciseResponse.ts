import type { ExerciseCategoryResponse } from "./ExerciseCategoryResponse";

 export type ExerciseResponse = {
    /**
     * @type integer | undefined, int64
    */
    id?: number;
    /**
     * @type string | undefined
    */
    title?: string;
    /**
     * @type string | undefined
    */
    description?: string;
    /**
     * @type string | undefined
    */
    imageUrl?: string;
    /**
     * @type string | undefined
    */
    videoUrl?: string;
    /**
     * @type integer | undefined, int32
    */
    durationMinutes?: number;
    /**
     * @type object | undefined
    */
    category?: ExerciseCategoryResponse;
    /**
     * @type string | undefined, date-time
    */
    createdAt?: string;
    /**
     * @type string | undefined, date-time
    */
    updatedAt?: string;
};