import { z } from "zod";


export const userCompanyInfoResponseSchema = z.object({ "id": z.number().int().optional(), "userId": z.number().int().optional(), "companyName": z.string().optional(), "companyTaxNumber": z.string().optional(), "invoiceIssuanceAddress": z.string().optional(), "createdAt": z.string().datetime().optional(), "updatedAt": z.string().datetime().optional() });