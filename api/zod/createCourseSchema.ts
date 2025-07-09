import { z } from "zod";
import { courseDtoSchema } from "./courseDtoSchema";

 /**
 * @description OK
 */
export const createCourse200Schema = z.lazy(() => courseDtoSchema);

 export const createCourseMutationRequestSchema = z.lazy(() => courseDtoSchema);
/**
 * @description OK
 */
export const createCourseMutationResponseSchema = z.lazy(() => courseDtoSchema);