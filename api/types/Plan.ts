import type { User } from "./User";
import type { Exercise } from "./Exercise";
import type { PlanExercise } from "./PlanExercise";

 export const planCategory = {
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
export type PlanCategory = (typeof planCategory)[keyof typeof planCategory];
export const planDifficulty = {
    "EASY": "EASY",
    "MEDIUM": "MEDIUM",
    "HARD": "HARD"
} as const;
export type PlanDifficulty = (typeof planDifficulty)[keyof typeof planDifficulty];
export const planTargetAreas = {
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
export type PlanTargetAreas = (typeof planTargetAreas)[keyof typeof planTargetAreas];
export type Plan = {
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
    category: PlanCategory;
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
    difficulty: PlanDifficulty;
    /**
     * @type array
    */
    targetAreas: PlanTargetAreas[];
    /**
     * @type object | undefined
    */
    createdBy?: User;
    /**
     * @type string, date-time
    */
    createdAt: string;
    /**
     * @type array
    */
    exercises: Exercise[];
    /**
     * @type array
    */
    planExercises: PlanExercise[];
};