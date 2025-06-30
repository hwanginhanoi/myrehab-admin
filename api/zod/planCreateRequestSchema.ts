import { planExerciseCreateRequestSchema } from "./planExerciseCreateRequestSchema";
import { z } from "zod";


export const planCreateRequestSchema = z.object({ "name": z.string(), "category": z.enum(["BACK_PAIN", "NECK_PAIN", "SHOULDER_PAIN", "KNEE_PAIN", "HIP_PAIN", "WRIST_PAIN", "CHRONIC_PAIN", "ARTHRITIS", "SCIATICA", "GENERAL"]), "information": z.string(), "thumbnailImageUrl": z.string().optional(), "totalDurationMinutes": z.number().int(), "difficulty": z.enum(["EASY", "MEDIUM", "HARD"]), "targetAreas": z.array(z.enum(["LOWER_BACK", "UPPER_BACK", "NECK", "SHOULDERS", "ARMS", "CHEST", "CORE", "HIPS", "GLUTES", "QUADS", "HAMSTRINGS", "CALVES", "ANKLES", "WRISTS", "FULL_BODY"])), "exerciseDetails": z.array(z.lazy(() => planExerciseCreateRequestSchema)) });