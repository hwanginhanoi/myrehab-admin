import type { BalanceResponse } from "./BalanceResponse";
import type { AddBalanceRequest } from "./AddBalanceRequest";

 /**
 * @description OK
*/
export type AddBalance200 = BalanceResponse;
export type AddBalanceMutationRequest = AddBalanceRequest;
/**
 * @description OK
*/
export type AddBalanceMutationResponse = BalanceResponse;
export type AddBalanceMutation = {
    Response: AddBalanceMutationResponse;
    Request: AddBalanceMutationRequest;
};