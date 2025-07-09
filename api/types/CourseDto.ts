import type { CategoryDto } from "./CategoryDto";
import type { ExerciseDto } from "./ExerciseDto";

 export type CourseDto = {
    /**
     * @type integer | undefined, int64
    */
    id?: number;
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
     * @type array | undefined
    */
    categories?: CategoryDto[];
    /**
     * @type array | undefined
    */
    exercises?: ExerciseDto[];
};