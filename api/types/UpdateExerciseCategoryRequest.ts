export const updateExerciseCategoryRequestType = {
    "BODY_PART": "BODY_PART",
    "RECOVERY_STAGE": "RECOVERY_STAGE",
    "HEALTH_CONDITION": "HEALTH_CONDITION",
    "DIFFICULTY_LEVEL": "DIFFICULTY_LEVEL",
    "EXERCISE_TYPE": "EXERCISE_TYPE"
} as const;
export type UpdateExerciseCategoryRequestType = (typeof updateExerciseCategoryRequestType)[keyof typeof updateExerciseCategoryRequestType];
export type UpdateExerciseCategoryRequest = {
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
    type: UpdateExerciseCategoryRequestType;
};