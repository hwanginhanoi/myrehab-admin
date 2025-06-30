import { grantedAuthoritySchema } from "./grantedAuthoritySchema";
import { z } from "zod";


export const userSchema = z.object({ "id": z.number().int(), "email": z.string(), "password": z.string(), "role": z.enum(["PATIENT", "DOCTOR", "ADMIN"]), "firstName": z.string(), "lastName": z.string(), "isActive": z.boolean(), "createdAt": z.string().datetime(), "updatedAt": z.string().datetime(), "isEnabled": z.boolean(), "isCredentialsNonExpired": z.boolean(), "authorities": z.array(z.lazy(() => grantedAuthoritySchema)), "username": z.string(), "active": z.boolean().optional(), "isAccountNonExpired": z.boolean(), "isAccountNonLocked": z.boolean() });