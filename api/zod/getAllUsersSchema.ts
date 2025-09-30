import { z } from "zod";
import { userResponseSchema } from "./userResponseSchema";

 /**
 * @description OK
 */
export const getAllUsers200Schema = z.array(z.lazy(() => userResponseSchema));
/**
 * @description OK
 */
export const getAllUsersQueryResponseSchema = z.array(z.lazy(() => userResponseSchema));