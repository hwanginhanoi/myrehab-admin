import type { Plan } from "./Plan";

 export const exerciseTargetAreas = {
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
export type ExerciseTargetAreas = (typeof exerciseTargetAreas)[keyof typeof exerciseTargetAreas];
export const exerciseDifficulty = {
    "EASY": "EASY",
    "MEDIUM": "MEDIUM",
    "HARD": "HARD"
} as const;
export type ExerciseDifficulty = (typeof exerciseDifficulty)[keyof typeof exerciseDifficulty];
export type Exercise = {
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
    durationSeconds?: number;
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
    timePerRepSeconds?: number;
    /**
     * @type string | undefined
    */
    cautions?: string;
    /**
     * @type array
    */
    targetAreas: ExerciseTargetAreas[];
    /**
     * @type integer | undefined, int32
    */
    restBetweenSets?: number;
    /**
     * @type string | undefined
    */
    equipmentNeeded?: string;
    /**
     * @type string
    */
    difficulty: ExerciseDifficulty;
    /**
     * @type array
    */
    plans: Plan[];
};