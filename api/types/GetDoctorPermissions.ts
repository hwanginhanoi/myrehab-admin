export type GetDoctorPermissionsPathParams = {
    /**
     * @type integer, int64
    */
    doctorId: number;
};
/**
 * @description OK
*/
export type GetDoctorPermissions200 = string[];
/**
 * @description OK
*/
export type GetDoctorPermissionsQueryResponse = string[];
export type GetDoctorPermissionsQuery = {
    Response: GetDoctorPermissionsQueryResponse;
    PathParams: GetDoctorPermissionsPathParams;
};