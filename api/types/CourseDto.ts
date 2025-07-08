import type { ExerciseDto } from "./ExerciseDto";
import type { CategoryDto } from "./CategoryDto";

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
    exercises?: ExerciseDto[];
    /**
     * @type array | undefined
    */
    categories?: CategoryDto[];
};