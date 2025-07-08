import type { Course } from "./Course";
import type { Category } from "./Category";
import type { Patient } from "./Patient";

 export type Exercise = {
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
     * @type string | undefined
    */
    videoUrl?: string;
    /**
     * @type number | undefined
    */
    price?: number;
    /**
     * @type array | undefined
    */
    courses?: Course[];
    /**
     * @type array | undefined
    */
    categories?: Category[];
    /**
     * @type array | undefined
    */
    purchasingPatients?: Patient[];
};