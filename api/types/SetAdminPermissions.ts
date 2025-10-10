import type { SetPermissionsRequest } from "./SetPermissionsRequest";

 export type SetAdminPermissionsPathParams = {
    /**
     * @type integer, int64
    */
    adminId: number;
};
/**
 * @description OK
*/
export type SetAdminPermissions200 = any;
export type SetAdminPermissionsMutationRequest = SetPermissionsRequest;
export type SetAdminPermissionsMutationResponse = any;
export type SetAdminPermissionsMutation = {
    Response: SetAdminPermissionsMutationResponse;
    Request: SetAdminPermissionsMutationRequest;
    PathParams: SetAdminPermissionsPathParams;
};