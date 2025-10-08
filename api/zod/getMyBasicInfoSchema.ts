import { z } from "zod";
import { userBasicInfoResponseSchema } from "./userBasicInfoResponseSchema";

 /**
 * @description OK
 */
export const getMyBasicInfo200Schema = z.lazy(() => userBasicInfoResponseSchema);
/**
 * @description OK
 */
export const getMyBasicInfoQueryResponseSchema = z.lazy(() => userBasicInfoResponseSchema);