import type { PlanExerciseResponse } from "./PlanExerciseResponse";

 export const planDetailResponseCategory = {
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
export type PlanDetailResponseCategory = (typeof planDetailResponseCategory)[keyof typeof planDetailResponseCategory];
export const planDetailResponseDifficulty = {
    "EASY": "EASY",
    "MEDIUM": "MEDIUM",
    "HARD": "HARD"
} as const;
export type PlanDetailResponseDifficulty = (typeof planDetailResponseDifficulty)[keyof typeof planDetailResponseDifficulty];
export const planDetailResponseTargetAreas = {
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
export type PlanDetailResponseTargetAreas = (typeof planDetailResponseTargetAreas)[keyof typeof planDetailResponseTargetAreas];
export type PlanDetailResponse = {
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
    category: PlanDetailResponseCategory;
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
    difficulty: PlanDetailResponseDifficulty;
    /**
     * @type array
    */
    targetAreas: PlanDetailResponseTargetAreas[];
    /**
     * @type array
    */
    exercises: PlanExerciseResponse[];
};