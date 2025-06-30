import type { Plan } from "./Plan";
import type { Exercise } from "./Exercise";

 export type PlanExercise = {
    /**
     * @type integer, int64
    */
    id: number;
    /**
     * @type object
    */
    plan: Plan;
    /**
     * @type object
    */
    exercise: Exercise;
    /**
     * @type integer, int32
    */
    orderIndex: number;
    /**
     * @type integer | undefined, int32
    */
    sets?: number;
    /**
     * @type integer | undefined, int32
    */
    repsPerSet?: number;
    /**
     * @type integer | undefined, int32
    */
    durationSeconds?: number;
    /**
     * @type integer | undefined, int32
    */
    restBetweenSetsSeconds?: number;
    /**
     * @type string | undefined
    */
    notes?: string;
};