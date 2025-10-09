export const authResponseRole = {
    "USER": "USER",
    "DOCTOR": "DOCTOR",
    "ADMIN": "ADMIN"
} as const;
export type AuthResponseRole = (typeof authResponseRole)[keyof typeof authResponseRole];
export type AuthResponse = {
    /**
     * @type string | undefined
    */
    token?: string;
    /**
     * @type string | undefined
    */
    refreshToken?: string;
    /**
     * @type string | undefined
    */
    email?: string;
    /**
     * @type string | undefined
    */
    role?: AuthResponseRole;
    /**
     * @type string | undefined
    */
    fullName?: string;
    /**
     * @type array | undefined
    */
    permissions?: string[];
};