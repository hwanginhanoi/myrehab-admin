import type { Course } from "./Course";
import type { Exercise } from "./Exercise";
import type { GrantedAuthority } from "./GrantedAuthority";

 export const patientRole = {
    "ADMIN": "ADMIN",
    "DOCTOR": "DOCTOR",
    "PATIENT": "PATIENT"
} as const;
export type PatientRole = (typeof patientRole)[keyof typeof patientRole];
export type Patient = {
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
    password?: string;
    /**
     * @type string | undefined
    */
    firstName?: string;
    /**
     * @type string | undefined
    */
    lastName?: string;
    /**
     * @type string | undefined
    */
    role?: PatientRole;
    /**
     * @type boolean | undefined
    */
    enabled?: boolean;
    /**
     * @type array | undefined
    */
    assignedCourses?: Course[];
    /**
     * @type array | undefined
    */
    purchasedCourses?: Course[];
    /**
     * @type array | undefined
    */
    purchasedExercises?: Exercise[];
    /**
     * @type boolean | undefined
    */
    accountNonExpired?: boolean;
    /**
     * @type boolean | undefined
    */
    accountNonLocked?: boolean;
    /**
     * @type array | undefined
    */
    authorities?: GrantedAuthority[];
    /**
     * @type string | undefined
    */
    username?: string;
    /**
     * @type boolean | undefined
    */
    credentialsNonExpired?: boolean;
};