import type { GrantedAuthority } from "./GrantedAuthority";

 export const userRole = {
    "PATIENT": "PATIENT",
    "DOCTOR": "DOCTOR",
    "ADMIN": "ADMIN"
} as const;
export type UserRole = (typeof userRole)[keyof typeof userRole];
export type User = {
    /**
     * @type integer, int64
    */
    id: number;
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
    role: UserRole;
    /**
     * @type string
    */
    firstName: string;
    /**
     * @type string
    */
    lastName: string;
    /**
     * @type boolean
    */
    isActive: boolean;
    /**
     * @type string, date-time
    */
    createdAt: string;
    /**
     * @type string, date-time
    */
    updatedAt: string;
    /**
     * @type boolean
    */
    isEnabled: boolean;
    /**
     * @type boolean
    */
    isCredentialsNonExpired: boolean;
    /**
     * @type array
    */
    authorities: GrantedAuthority[];
    /**
     * @type string
    */
    username: string;
    /**
     * @type boolean | undefined
    */
    active?: boolean;
    /**
     * @type boolean
    */
    isAccountNonExpired: boolean;
    /**
     * @type boolean
    */
    isAccountNonLocked: boolean;
};