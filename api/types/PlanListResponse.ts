export const planListResponseCategory = {
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
export type PlanListResponseCategory = (typeof planListResponseCategory)[keyof typeof planListResponseCategory];
export const planListResponseDifficulty = {
    "EASY": "EASY",
    "MEDIUM": "MEDIUM",
    "HARD": "HARD"
} as const;
export type PlanListResponseDifficulty = (typeof planListResponseDifficulty)[keyof typeof planListResponseDifficulty];
export const planListResponseTargetAreas = {
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
export type PlanListResponseTargetAreas = (typeof planListResponseTargetAreas)[keyof typeof planListResponseTargetAreas];
export type PlanListResponse = {
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
    category: PlanListResponseCategory;
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
    difficulty: PlanListResponseDifficulty;
    /**
     * @type array
    */
    targetAreas: PlanListResponseTargetAreas[];
    /**
     * @type integer, int32
    */
    exerciseCount: number;
    /**
     * @type string, date-time
    */
    createdAt: string;
};