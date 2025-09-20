import type { CategoryResponse } from "./CategoryResponse";
import type { CourseDayResponse } from "./CourseDayResponse";

 export type CourseResponse = {
    /**
     * @type integer | undefined, int64
    */
    id?: number;
    /**
     * @type string | undefined
    */
    title?: string;
    /**
     * @type string | undefined
    */
    description?: string;
    /**
     * @type string | undefined
    */
    imageUrl?: string;
    /**
     * @type number | undefined
    */
    price?: number;
    /**
     * @type integer | undefined, int32
    */
    durationDays?: number;
    /**
     * @type boolean | undefined
    */
    isActive?: boolean;
    /**
     * @type object | undefined
    */
    category?: CategoryResponse;
    /**
     * @type array | undefined
    */
    courseDays?: CourseDayResponse[];
    /**
     * @type string | undefined, date-time
    */
    createdAt?: string;
    /**
     * @type string | undefined, date-time
    */
    updatedAt?: string;
};