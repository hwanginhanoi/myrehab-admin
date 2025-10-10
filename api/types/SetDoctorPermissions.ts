import type { SetPermissionsRequest } from "./SetPermissionsRequest";

 export type SetDoctorPermissionsPathParams = {
    /**
     * @type integer, int64
    */
    doctorId: number;
};
/**
 * @description OK
*/
export type SetDoctorPermissions200 = any;
export type SetDoctorPermissionsMutationRequest = SetPermissionsRequest;
export type SetDoctorPermissionsMutationResponse = any;
export type SetDoctorPermissionsMutation = {
    Response: SetDoctorPermissionsMutationResponse;
    Request: SetDoctorPermissionsMutationRequest;
    PathParams: SetDoctorPermissionsPathParams;
};