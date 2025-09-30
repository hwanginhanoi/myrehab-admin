import type { PurchaseResponse } from "./PurchaseResponse";

 export type BuyCoursePathParams = {
    /**
     * @type integer, int64
    */
    courseId: number;
};
/**
 * @description OK
*/
export type BuyCourse200 = PurchaseResponse;
/**
 * @description OK
*/
export type BuyCourseMutationResponse = PurchaseResponse;
export type BuyCourseMutation = {
    Response: BuyCourseMutationResponse;
    PathParams: BuyCoursePathParams;
};