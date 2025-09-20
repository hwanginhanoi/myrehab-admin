import type { PresignedUrlResponse } from "./PresignedUrlResponse";
import type { PresignedUrlRequest } from "./PresignedUrlRequest";

 /**
 * @description OK
*/
export type GeneratePresignedUploadUrl200 = PresignedUrlResponse;
export type GeneratePresignedUploadUrlMutationRequest = PresignedUrlRequest;
/**
 * @description OK
*/
export type GeneratePresignedUploadUrlMutationResponse = PresignedUrlResponse;
export type GeneratePresignedUploadUrlMutation = {
    Response: GeneratePresignedUploadUrlMutationResponse;
    Request: GeneratePresignedUploadUrlMutationRequest;
};