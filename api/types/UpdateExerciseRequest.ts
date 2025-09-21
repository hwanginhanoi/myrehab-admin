export type UpdateExerciseRequest = {
    /**
     * @type string
    */
    title: string;
    /**
     * @type string | undefined
    */
    description?: string;
    /**
     * @type string | undefined
    */
    imageUrl?: string;
    /**
     * @type string
    */
    videoUrl: string;
    /**
     * @type integer, int32
    */
    durationMinutes: number;
    /**
     * @type integer, int32
    */
    repetitions: number;
    /**
     * @type integer, int32
    */
    sets: number;
    /**
     * @type number
    */
    price: number;
    /**
     * @type integer | undefined, int64
    */
    categoryId?: number;
};