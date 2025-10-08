export const createExerciseCategoryRequestType = {
    "BODY_PART": "BODY_PART",
    "RECOVERY_STAGE": "RECOVERY_STAGE",
    "HEALTH_CONDITION": "HEALTH_CONDITION",
    "DIFFICULTY_LEVEL": "DIFFICULTY_LEVEL",
    "EXERCISE_TYPE": "EXERCISE_TYPE"
} as const;
export type CreateExerciseCategoryRequestType = (typeof createExerciseCategoryRequestType)[keyof typeof createExerciseCategoryRequestType];
export type CreateExerciseCategoryRequest = {
    /**
     * @type string
    */
    name: string;
    /**
     * @type string | undefined
    */
    description?: string;
    /**
     * @type string
    */
    type: CreateExerciseCategoryRequestType;
};