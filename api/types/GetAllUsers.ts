import type { UserResponse } from "./UserResponse";

 /**
 * @description OK
*/
export type GetAllUsers200 = UserResponse[];
/**
 * @description OK
*/
export type GetAllUsersQueryResponse = UserResponse[];
export type GetAllUsersQuery = {
    Response: GetAllUsersQueryResponse;
};