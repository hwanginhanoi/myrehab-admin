export const createCategoryRequestType = {
    "BODY_PART": "BODY_PART",
    "RECOVERY_STAGE": "RECOVERY_STAGE",
    "HEALTH_CONDITION": "HEALTH_CONDITION",
    "DIFFICULTY_LEVEL": "DIFFICULTY_LEVEL",
    "EXERCISE_TYPE": "EXERCISE_TYPE"
} as const;
export type CreateCategoryRequestType = (typeof createCategoryRequestType)[keyof typeof createCategoryRequestType];
export type CreateCategoryRequest = {
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
    type: CreateCategoryRequestType;
};