import { z } from "zod";
import { userBasicInfoResponseSchema } from "./userBasicInfoResponseSchema";
import { userBasicInfoRequestSchema } from "./userBasicInfoRequestSchema";

 /**
 * @description OK
 */
export const updateMyBasicInfo200Schema = z.lazy(() => userBasicInfoResponseSchema);

 export const updateMyBasicInfoMutationRequestSchema = z.lazy(() => userBasicInfoRequestSchema);
/**
 * @description OK
 */
export const updateMyBasicInfoMutationResponseSchema = z.lazy(() => userBasicInfoResponseSchema);