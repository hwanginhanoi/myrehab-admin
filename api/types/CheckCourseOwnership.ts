export type CheckCourseOwnershipPathParams = {
    /**
     * @type integer, int64
    */
    courseId: number;
};
/**
 * @description OK
*/
export type CheckCourseOwnership200 = boolean;
/**
 * @description OK
*/
export type CheckCourseOwnershipQueryResponse = boolean;
export type CheckCourseOwnershipQuery = {
    Response: CheckCourseOwnershipQueryResponse;
    PathParams: CheckCourseOwnershipPathParams;
};