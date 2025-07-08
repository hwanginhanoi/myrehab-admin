import { exerciseSchema } from "./exerciseSchema";
import { courseSchema } from "./courseSchema";
import { z } from "zod";


export const categorySchema = z.object({ "id": z.number().int().optional(), "name": z.string().optional(), "type": z.enum(["BODY_PART", "RECOVERY_STAGE", "HEALTH_CONDITION"]).optional(), "exercises": z.array(z.lazy(() => exerciseSchema)).optional(), "courses": z.array(z.lazy(() => courseSchema)).optional() });