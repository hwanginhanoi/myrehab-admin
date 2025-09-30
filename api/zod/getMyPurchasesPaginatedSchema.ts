import { z } from "zod";
import { pageableSchema } from "./pageableSchema";
import { pagePurchaseResponseSchema } from "./pagePurchaseResponseSchema";


export const getMyPurchasesPaginatedQueryParamsSchema = z.object({ "pageable": z.lazy(() => pageableSchema) });
/**
 * @description OK
 */
export const getMyPurchasesPaginated200Schema = z.lazy(() => pagePurchaseResponseSchema);
/**
 * @description OK
 */
export const getMyPurchasesPaginatedQueryResponseSchema = z.lazy(() => pagePurchaseResponseSchema);