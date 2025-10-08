import { z } from "zod";


export const userCompanyInfoRequestSchema = z.object({ "companyName": z.string().optional(), "companyTaxNumber": z.string().optional(), "invoiceIssuanceAddress": z.string().optional() });