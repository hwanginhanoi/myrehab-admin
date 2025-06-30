import type { PlanExerciseCreateRequest } from "./PlanExerciseCreateRequest";

 export const planCreateRequestCategory = {
    "BACK_PAIN": "BACK_PAIN",
    "NECK_PAIN": "NECK_PAIN",
    "SHOULDER_PAIN": "SHOULDER_PAIN",
    "KNEE_PAIN": "KNEE_PAIN",
    "HIP_PAIN": "HIP_PAIN",
    "WRIST_PAIN": "WRIST_PAIN",
    "CHRONIC_PAIN": "CHRONIC_PAIN",
    "ARTHRITIS": "ARTHRITIS",
    "SCIATICA": "SCIATICA",
    "GENERAL": "GENERAL"
} as const;
export type PlanCreateRequestCategory = (typeof planCreateRequestCategory)[keyof typeof planCreateRequestCategory];
export const planCreateRequestDifficulty = {
    "EASY": "EASY",
    "MEDIUM": "MEDIUM",
    "HARD": "HARD"
} as const;
export type PlanCreateRequestDifficulty = (typeof planCreateRequestDifficulty)[keyof typeof planCreateRequestDifficulty];
export const planCreateRequestTargetAreas = {
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
export type PlanCreateRequestTargetAreas = (typeof planCreateRequestTargetAreas)[keyof typeof planCreateRequestTargetAreas];
export type PlanCreateRequest = {
    /**
     * @type string
    */
    name: string;
    /**
     * @type string
    */
    category: PlanCreateRequestCategory;
    /**
     * @type string
    */
    information: string;
    /**
     * @type string | undefined
    */
    thumbnailImageUrl?: string;
    /**
     * @type integer, int32
    */
    totalDurationMinutes: number;
    /**
     * @type string
    */
    difficulty: PlanCreateRequestDifficulty;
    /**
     * @type array
    */
    targetAreas: PlanCreateRequestTargetAreas[];
    /**
     * @type array
    */
    exerciseDetails: PlanExerciseCreateRequest[];
};