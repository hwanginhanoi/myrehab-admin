import { z } from "zod";


export const checkCourseOwnershipPathParamsSchema = z.object({ "courseId": z.number().int() });
/**
 * @description OK
 */
export const checkCourseOwnership200Schema = z.boolean();
/**
 * @description OK
 */
export const checkCourseOwnershipQueryResponseSchema = z.boolean();