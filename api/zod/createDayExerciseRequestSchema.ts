import { z } from "zod";


export const createDayExerciseRequestSchema = z.object({ "exerciseId": z.number().int(), "orderInDay": z.number().int() });