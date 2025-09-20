import { createDayExerciseRequestSchema } from "./createDayExerciseRequestSchema";
import { z } from "zod";


export const createCourseDayRequestSchema = z.object({ "dayNumber": z.number().int(), "dayDescription": z.string().optional(), "dayExercises": z.array(z.lazy(() => createDayExerciseRequestSchema)).min(1) });