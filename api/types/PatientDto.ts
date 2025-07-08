import type { CourseDto } from "./CourseDto";
import type { ExerciseDto } from "./ExerciseDto";

 export type PatientDto = {
    /**
     * @type integer | undefined, int64
    */
    id?: number;
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
    email: string;
    /**
     * @type string | undefined
    */
    password?: string;
    /**
     * @type boolean | undefined
    */
    enabled?: boolean;
    /**
     * @type array | undefined
    */
    assignedCourses?: CourseDto[];
    /**
     * @type array | undefined
    */
    purchasedCourses?: CourseDto[];
    /**
     * @type array | undefined
    */
    purchasedExercises?: ExerciseDto[];
};