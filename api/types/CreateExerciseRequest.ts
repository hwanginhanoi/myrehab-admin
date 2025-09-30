export type CreateExerciseRequest = {
    /**
     * @type string
    */
    title: string;
    /**
     * @type string | undefined
    */
    description?: string;
    /**
     * @type string
    */
    imageUrl: string;
    /**
     * @type string
    */
    videoUrl: string;
    /**
     * @type integer, int32
    */
    durationMinutes: number;
    /**
     * @type integer | undefined, int64
    */
    categoryId?: number;
};