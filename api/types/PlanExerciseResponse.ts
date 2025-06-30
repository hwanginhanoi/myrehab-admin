export type PlanExerciseResponse = {
    /**
     * @type integer, int64
    */
    id: number;
    /**
     * @type string
    */
    name: string;
    /**
     * @type string
    */
    description: string;
    /**
     * @type string
    */
    instructions: string;
    /**
     * @type string | undefined
    */
    videoUrl?: string;
    /**
     * @type string | undefined
    */
    imageUrl?: string;
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
    /**
     * @type integer, int32
    */
    orderIndex: number;
    /**
     * @type string | undefined
    */
    cautions?: string;
    /**
     * @type string | undefined
    */
    equipmentNeeded?: string;
};