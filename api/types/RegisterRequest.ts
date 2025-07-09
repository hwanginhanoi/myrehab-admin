export const registerRequestRole = {
    "ADMIN": "ADMIN",
    "DOCTOR": "DOCTOR",
    "PATIENT": "PATIENT"
} as const;
export type RegisterRequestRole = (typeof registerRequestRole)[keyof typeof registerRequestRole];
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
     * @type string
    */
    role: RegisterRequestRole;
    /**
     * @type string | undefined
    */
    specialization?: string;
};