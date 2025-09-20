import type { FileUploadResponse } from "./FileUploadResponse";

 /**
 * @description OK
*/
export type UploadImage200 = FileUploadResponse;
export type UploadImageMutationRequest = {
    /**
     * @description Image file to upload
     * @type string, binary
    */
    file: Blob;
};
/**
 * @description OK
*/
export type UploadImageMutationResponse = FileUploadResponse;
export type UploadImageMutation = {
    Response: UploadImageMutationResponse;
    Request: UploadImageMutationRequest;
};