export type Pageable = {
    /**
     * @type integer | undefined, int32
    */
    page?: number;
    /**
     * @type integer | undefined, int32
    */
    size?: number;
    /**
     * @type array | undefined
    */
    sort?: string[];
};