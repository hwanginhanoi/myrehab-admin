import type { Exercise } from "./Exercise";
import type { Course } from "./Course";

 export const categoryType = {
    "BODY_PART": "BODY_PART",
    "RECOVERY_STAGE": "RECOVERY_STAGE",
    "HEALTH_CONDITION": "HEALTH_CONDITION"
} as const;
export type CategoryType = (typeof categoryType)[keyof typeof categoryType];
export type Category = {
    /**
     * @type integer | undefined, int64
    */
    id?: number;
    /**
     * @type string | undefined
    */
    name?: string;
    /**
     * @type string | undefined
    */
    type?: CategoryType;
    /**
     * @type array | undefined
    */
    exercises?: Exercise[];
    /**
     * @type array | undefined
    */
    courses?: Course[];
};