import type { AssignPermissionRequest } from "./AssignPermissionRequest";

 export type RemovePermissionFromAdminPathParams = {
    /**
     * @type integer, int64
    */
    adminId: number;
};
/**
 * @description OK
*/
export type RemovePermissionFromAdmin200 = any;
export type RemovePermissionFromAdminMutationRequest = AssignPermissionRequest;
export type RemovePermissionFromAdminMutationResponse = any;
export type RemovePermissionFromAdminMutation = {
    Response: RemovePermissionFromAdminMutationResponse;
    Request: RemovePermissionFromAdminMutationRequest;
    PathParams: RemovePermissionFromAdminPathParams;
};