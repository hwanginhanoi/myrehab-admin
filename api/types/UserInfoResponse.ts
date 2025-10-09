export const userInfoResponseRole = {
    "USER": "USER",
    "DOCTOR": "DOCTOR",
    "ADMIN": "ADMIN"
} as const;
export type UserInfoResponseRole = (typeof userInfoResponseRole)[keyof typeof userInfoResponseRole];
export type UserInfoResponse = {
    /**
     * @type integer | undefined, int64
    */
    id?: number;
    /**
     * @type string | undefined
    */
    email?: string;
    /**
     * @type string | undefined
    */
    fullName?: string;
    /**
     * @type string | undefined
    */
    role?: UserInfoResponseRole;
    /**
     * @type array | undefined
    */
    permissions?: string[];
    /**
     * @type string | undefined
    */
    phoneNumber?: string;
};