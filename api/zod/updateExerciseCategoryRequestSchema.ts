import { z } from "zod";


export const updateExerciseCategoryRequestSchema = z.object({ "name": z.string().min(1), "description": z.string().optional(), "type": z.enum(["BODY_PART", "RECOVERY_STAGE", "HEALTH_CONDITION", "DIFFICULTY_LEVEL", "EXERCISE_TYPE"]) });