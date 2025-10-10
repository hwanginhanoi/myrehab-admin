import type { AssignPermissionRequest } from "./AssignPermissionRequest";

 export type AssignPermissionToAdminPathParams = {
    /**
     * @type integer, int64
    */
    adminId: number;
};
/**
 * @description OK
*/
export type AssignPermissionToAdmin200 = any;
export type AssignPermissionToAdminMutationRequest = AssignPermissionRequest;
export type AssignPermissionToAdminMutationResponse = any;
export type AssignPermissionToAdminMutation = {
    Response: AssignPermissionToAdminMutationResponse;
    Request: AssignPermissionToAdminMutationRequest;
    PathParams: AssignPermissionToAdminPathParams;
};