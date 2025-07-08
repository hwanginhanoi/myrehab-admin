import type { CategoryDto } from "./CategoryDto";

 export type ExerciseDto = {
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
     * @type string | undefined
    */
    videoUrl?: string;
    /**
     * @type number
    */
    price: number;
    /**
     * @type array | undefined
    */
    categories?: CategoryDto[];
};