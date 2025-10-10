export type GetAdminPermissionsPathParams = {
    /**
     * @type integer, int64
    */
    adminId: number;
};
/**
 * @description OK
*/
export type GetAdminPermissions200 = string[];
/**
 * @description OK
*/
export type GetAdminPermissionsQueryResponse = string[];
export type GetAdminPermissionsQuery = {
    Response: GetAdminPermissionsQueryResponse;
    PathParams: GetAdminPermissionsPathParams;
};