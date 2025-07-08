import type { Exercise } from "./Exercise";
import type { Category } from "./Category";
import type { Patient } from "./Patient";

 export type Course = {
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
     * @type array | undefined
    */
    exercises?: Exercise[];
    /**
     * @type array | undefined
    */
    categories?: Category[];
    /**
     * @type array | undefined
    */
    assignedPatients?: Patient[];
    /**
     * @type array | undefined
    */
    purchasingPatients?: Patient[];
};