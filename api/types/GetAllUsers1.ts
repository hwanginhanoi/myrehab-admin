import type { UserResponse } from "./UserResponse";

 /**
 * @description OK
*/
export type GetAllUsers1200 = UserResponse[];
/**
 * @description OK
*/
export type GetAllUsers1QueryResponse = UserResponse[];
export type GetAllUsers1Query = {
    Response: GetAllUsers1QueryResponse;
};