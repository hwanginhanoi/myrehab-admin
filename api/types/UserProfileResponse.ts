export type UserProfileResponse = {
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
    vietnameseIdentityCard?: string;
    /**
     * @type string | undefined
    */
    jobTitle?: string;
    /**
     * @type string | undefined
    */
    address?: string;
    /**
     * @type string | undefined
    */
    nationality?: string;
    /**
     * @type string | undefined
    */
    ethnic?: string;
    /**
     * @type string | undefined, date-time
    */
    createdAt?: string;
    /**
     * @type string | undefined, date-time
    */
    updatedAt?: string;
};