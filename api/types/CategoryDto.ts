export const categoryDtoType = {
    "BODY_PART": "BODY_PART",
    "RECOVERY_STAGE": "RECOVERY_STAGE",
    "HEALTH_CONDITION": "HEALTH_CONDITION"
} as const;
export type CategoryDtoType = (typeof categoryDtoType)[keyof typeof categoryDtoType];
export type CategoryDto = {
    /**
     * @type integer | undefined, int64
    */
    id?: number;
    /**
     * @type string
    */
    name: string;
    /**
     * @type string
    */
    type: CategoryDtoType;
};