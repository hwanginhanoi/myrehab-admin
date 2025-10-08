import type { ExerciseResponse } from "./ExerciseResponse";
import type { SortObject } from "./SortObject";
import type { PageableObject } from "./PageableObject";

 export type PageExerciseResponse = {
    /**
     * @type integer | undefined, int64
    */
    totalElements?: number;
    /**
     * @type integer | undefined, int32
    */
    totalPages?: number;
    /**
     * @type boolean | undefined
    */
    first?: boolean;
    /**
     * @type boolean | undefined
    */
    last?: boolean;
    /**
     * @type integer | undefined, int32
    */
    size?: number;
    /**
     * @type array | undefined
    */
    content?: ExerciseResponse[];
    /**
     * @type integer | undefined, int32
    */
    number?: number;
    /**
     * @type object | undefined
    */
    sort?: SortObject;
    /**
     * @type integer | undefined, int32
    */
    numberOfElements?: number;
    /**
     * @type object | undefined
    */
    pageable?: PageableObject;
    /**
     * @type boolean | undefined
    */
    empty?: boolean;
};