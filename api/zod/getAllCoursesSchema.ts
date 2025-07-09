import { z } from "zod";
import { courseDtoSchema } from "./courseDtoSchema";

 /**
 * @description OK
 */
export const getAllCourses200Schema = z.array(z.lazy(() => courseDtoSchema));
/**
 * @description OK
 */
export const getAllCoursesQueryResponseSchema = z.array(z.lazy(() => courseDtoSchema));