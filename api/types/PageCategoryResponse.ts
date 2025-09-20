import type { CategoryResponse } from "./CategoryResponse";
import type { SortObject } from "./SortObject";
import type { PageableObject } from "./PageableObject";

 export type PageCategoryResponse = {
    /**
     * @type integer | undefined, int32
    */
    totalPages?: number;
    /**
     * @type integer | undefined, int64
    */
    totalElements?: number;
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
    content?: CategoryResponse[];
    /**
     * @type integer | undefined, int32
    */
    number?: number;
    /**
     * @type object | undefined
    */
    sort?: SortObject;
    /**
     * @type object | undefined
    */
    pageable?: PageableObject;
    /**
     * @type integer | undefined, int32
    */
    numberOfElements?: number;
    /**
     * @type boolean | undefined
    */
    empty?: boolean;
};