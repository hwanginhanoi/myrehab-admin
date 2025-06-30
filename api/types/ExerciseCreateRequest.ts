export const exerciseCreateRequestTargetAreas = {
    "LOWER_BACK": "LOWER_BACK",
    "UPPER_BACK": "UPPER_BACK",
    "NECK": "NECK",
    "SHOULDERS": "SHOULDERS",
    "ARMS": "ARMS",
    "CHEST": "CHEST",
    "CORE": "CORE",
    "HIPS": "HIPS",
    "GLUTES": "GLUTES",
    "QUADS": "QUADS",
    "HAMSTRINGS": "HAMSTRINGS",
    "CALVES": "CALVES",
    "ANKLES": "ANKLES",
    "WRISTS": "WRISTS",
    "FULL_BODY": "FULL_BODY"
} as const;
export type ExerciseCreateRequestTargetAreas = (typeof exerciseCreateRequestTargetAreas)[keyof typeof exerciseCreateRequestTargetAreas];
export const exerciseCreateRequestDifficulty = {
    "EASY": "EASY",
    "MEDIUM": "MEDIUM",
    "HARD": "HARD"
} as const;
export type ExerciseCreateRequestDifficulty = (typeof exerciseCreateRequestDifficulty)[keyof typeof exerciseCreateRequestDifficulty];
export type ExerciseCreateRequest = {
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
     * @type array
    */
    targetAreas: ExerciseCreateRequestTargetAreas[];
    /**
     * @type string
    */
    difficulty: ExerciseCreateRequestDifficulty;
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
     * @type integer | undefined, int32
    */
    restBetweenSets?: number;
    /**
     * @type string | undefined
    */
    cautions?: string;
    /**
     * @type string | undefined
    */
    equipmentNeeded?: string;
    /**
     * @type string | undefined
    */
    videoUrl?: string;
    /**
     * @type string | undefined
    */
    imageUrl?: string;
};