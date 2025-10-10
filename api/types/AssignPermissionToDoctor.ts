import type { AssignPermissionRequest } from "./AssignPermissionRequest";

 export type AssignPermissionToDoctorPathParams = {
    /**
     * @type integer, int64
    */
    doctorId: number;
};
/**
 * @description OK
*/
export type AssignPermissionToDoctor200 = any;
export type AssignPermissionToDoctorMutationRequest = AssignPermissionRequest;
export type AssignPermissionToDoctorMutationResponse = any;
export type AssignPermissionToDoctorMutation = {
    Response: AssignPermissionToDoctorMutationResponse;
    Request: AssignPermissionToDoctorMutationRequest;
    PathParams: AssignPermissionToDoctorPathParams;
};