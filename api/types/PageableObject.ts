import type { SortObject } from "./SortObject";

 export type PageableObject = {
    /**
     * @type integer | undefined, int64
    */
    offset?: number;
    /**
     * @type object | undefined
    */
    sort?: SortObject;
    /**
     * @type boolean | undefined
    */
    unpaged?: boolean;
    /**
     * @type boolean | undefined
    */
    paged?: boolean;
    /**
     * @type integer | undefined, int32
    */
    pageNumber?: number;
    /**
     * @type integer | undefined, int32
    */
    pageSize?: number;
};