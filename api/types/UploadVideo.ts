import type { FileUploadResponse } from "./FileUploadResponse";

 /**
 * @description OK
*/
export type UploadVideo200 = FileUploadResponse;
export type UploadVideoMutationRequest = {
    /**
     * @description Video file to upload
     * @type string, binary
    */
    file: Blob;
};
/**
 * @description OK
*/
export type UploadVideoMutationResponse = FileUploadResponse;
export type UploadVideoMutation = {
    Response: UploadVideoMutationResponse;
    Request: UploadVideoMutationRequest;
};