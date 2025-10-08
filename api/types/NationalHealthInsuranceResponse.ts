export type NationalHealthInsuranceResponse = {
    /**
     * @type integer | undefined, int64
    */
    id?: number;
    /**
     * @type integer | undefined, int64
    */
    userId?: number;
    /**
     * @type string | undefined
    */
    insuranceNumber?: string;
    /**
     * @type string | undefined
    */
    placeOfRegistration?: string;
    /**
     * @type string | undefined, date-time
    */
    createdAt?: string;
    /**
     * @type string | undefined, date-time
    */
    updatedAt?: string;
};