import { z } from "zod";
import { userInfoResponseSchema } from "./userInfoResponseSchema";

 /**
 * @description OK
 */
export const getCurrentUser200Schema = z.lazy(() => userInfoResponseSchema);
/**
 * @description OK
 */
export const getCurrentUserQueryResponseSchema = z.lazy(() => userInfoResponseSchema);