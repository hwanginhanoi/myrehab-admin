export type UserResponse = {
    /**
     * @type integer | undefined, int64
    */
    id?: number;
    /**
     * @type string | undefined
    */
    fullName?: string;
    /**
     * @type string | undefined
    */
    phoneNumber?: string;
    /**
     * @type string | undefined
    */
    email?: string;
    /**
     * @type boolean | undefined
    */
    enabled?: boolean;
    /**
     * @type boolean | undefined
    */
    otpVerified?: boolean;
    /**
     * @type string | undefined, date-time
    */
    createdAt?: string;
    /**
     * @type string | undefined, date-time
    */
    updatedAt?: string;
};