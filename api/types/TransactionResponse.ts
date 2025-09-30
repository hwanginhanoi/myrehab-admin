export type TransactionResponse = {
    /**
     * @type integer | undefined, int64
    */
    id?: number;
    /**
     * @type string | undefined
    */
    type?: string;
    /**
     * @type number | undefined
    */
    amount?: number;
    /**
     * @type string | undefined
    */
    description?: string;
    /**
     * @type string | undefined, date-time
    */
    createdAt?: string;
};