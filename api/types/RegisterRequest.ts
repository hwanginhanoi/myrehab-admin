export type RegisterRequest = {
    /**
     * @type string
    */
    email: string;
    /**
     * @type string
    */
    password: string;
    /**
     * @type string
    */
    firstName: string;
    /**
     * @type string
    */
    lastName: string;
    /**
     * @type string | undefined
    */
    dateOfBirth?: string;
    /**
     * @type string | undefined
    */
    phone?: string;
};