export type CreateDayExerciseRequest = {
    /**
     * @type integer, int64
    */
    exerciseId: number;
    /**
     * @type integer, int32
    */
    orderInDay: number;
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
};