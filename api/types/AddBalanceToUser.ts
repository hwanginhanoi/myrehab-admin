import type { BalanceResponse } from "./BalanceResponse";
import type { AddBalanceRequest } from "./AddBalanceRequest";

 export type AddBalanceToUserPathParams = {
    /**
     * @type integer, int64
    */
    userId: number;
};
/**
 * @description OK
*/
export type AddBalanceToUser200 = BalanceResponse;
export type AddBalanceToUserMutationRequest = AddBalanceRequest;
/**
 * @description OK
*/
export type AddBalanceToUserMutationResponse = BalanceResponse;
export type AddBalanceToUserMutation = {
    Response: AddBalanceToUserMutationResponse;
    Request: AddBalanceToUserMutationRequest;
    PathParams: AddBalanceToUserPathParams;
};