import { z } from "zod";
import { userResponseSchema } from "./userResponseSchema";

 /**
 * @description OK
 */
export const getAllUsers1200Schema = z.array(z.lazy(() => userResponseSchema));
/**
 * @description OK
 */
export const getAllUsers1QueryResponseSchema = z.array(z.lazy(() => userResponseSchema));