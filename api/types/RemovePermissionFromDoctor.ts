import type { AssignPermissionRequest } from "./AssignPermissionRequest";

 export type RemovePermissionFromDoctorPathParams = {
    /**
     * @type integer, int64
    */
    doctorId: number;
};
/**
 * @description OK
*/
export type RemovePermissionFromDoctor200 = any;
export type RemovePermissionFromDoctorMutationRequest = AssignPermissionRequest;
export type RemovePermissionFromDoctorMutationResponse = any;
export type RemovePermissionFromDoctorMutation = {
    Response: RemovePermissionFromDoctorMutationResponse;
    Request: RemovePermissionFromDoctorMutationRequest;
    PathParams: RemovePermissionFromDoctorPathParams;
};