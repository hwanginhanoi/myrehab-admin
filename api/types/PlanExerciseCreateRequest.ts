export type PlanExerciseCreateRequest = {
    /**
     * @type integer, int64
    */
    exerciseId: number;
    /**
     * @type integer, int32
    */
    orderIndex: number;
    /**
     * @type integer | undefined, int32
    */
    sets?: number;
    /**
     * @type integer | undefined, int32
    */
    repsPerSet?: number;
    /**
     * @type integer | undefined, int32
    */
    durationSeconds?: number;
};