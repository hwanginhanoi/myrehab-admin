import { z } from "zod";
import { purchaseResponseSchema } from "./purchaseResponseSchema";


export const buyCoursePathParamsSchema = z.object({ "courseId": z.number().int() });
/**
 * @description OK
 */
export const buyCourse200Schema = z.lazy(() => purchaseResponseSchema);
/**
 * @description OK
 */
export const buyCourseMutationResponseSchema = z.lazy(() => purchaseResponseSchema);