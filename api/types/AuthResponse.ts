export type AuthResponse = {
    /**
     * @type string
    */
    token: string;
    /**
     * @type string | undefined
    */
    refreshToken?: string;
    /**
     * @type integer, int64
    */
    userId: number;
    /**
     * @type string
    */
    email: string;
    /**
     * @type string
    */
    firstName: string;
    /**
     * @type string
    */
    lastName: string;
    /**
     * @type string
    */
    role: string;
};