import { z } from "zod";


export const categoryDtoSchema = z.object({ "id": z.number().int().optional(), "name": z.string().min(1), "type": z.enum(["BODY_PART", "RECOVERY_STAGE", "HEALTH_CONDITION"]) });