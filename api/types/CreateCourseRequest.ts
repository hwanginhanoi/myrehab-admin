import type { CreateCourseDayRequest } from "./CreateCourseDayRequest";

 export type CreateCourseRequest = {
    /**
     * @type string
    */
    title: string;
    /**
     * @type string | undefined
    */
    description?: string;
    /**
     * @type string | undefined
    */
    imageUrl?: string;
    /**
     * @type number
    */
    price: number;
    /**
     * @type integer, int32
    */
    durationDays: number;
    /**
     * @type integer | undefined, int64
    */
    categoryId?: number;
    /**
     * @type array
    */
    courseDays: CreateCourseDayRequest[];
};