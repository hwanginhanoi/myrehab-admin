import { z } from "zod";
import { courseCategoryResponseSchema } from "./courseCategoryResponseSchema";

 /**
 * @description OK
 */
export const getAllCategories1200Schema = z.array(z.lazy(() => courseCategoryResponseSchema));
/**
 * @description OK
 */
export const getAllCategories1QueryResponseSchema = z.array(z.lazy(() => courseCategoryResponseSchema));