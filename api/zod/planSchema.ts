import { userSchema } from "./userSchema";
import { exerciseSchema } from "./exerciseSchema";
import { planExerciseSchema } from "./planExerciseSchema";
import { z } from "zod";


export const planSchema = z.object({ "id": z.number().int(), "name": z.string(), "category": z.enum(["BACK_PAIN", "NECK_PAIN", "SHOULDER_PAIN", "KNEE_PAIN", "HIP_PAIN", "WRIST_PAIN", "CHRONIC_PAIN", "ARTHRITIS", "SCIATICA", "GENERAL"]), "information": z.string(), "thumbnailImageUrl": z.string().optional(), "totalDurationMinutes": z.number().int(), "difficulty": z.enum(["EASY", "MEDIUM", "HARD"]), "targetAreas": z.array(z.enum(["LOWER_BACK", "UPPER_BACK", "NECK", "SHOULDERS", "ARMS", "CHEST", "CORE", "HIPS", "GLUTES", "QUADS", "HAMSTRINGS", "CALVES", "ANKLES", "WRISTS", "FULL_BODY"])), "createdBy": z.lazy(() => userSchema).optional(), "createdAt": z.string().datetime(), "exercises": z.array(z.lazy(() => exerciseSchema)), "planExercises": z.array(z.lazy(() => planExerciseSchema)) });