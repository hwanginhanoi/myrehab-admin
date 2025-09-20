export type DeleteFileQueryParams = {
    /**
     * @description S3 file URL to delete
     * @type string
    */
    fileUrl: string;
};
/**
 * @description OK
*/
export type DeleteFile200 = any;
export type DeleteFileMutationResponse = any;
export type DeleteFileMutation = {
    Response: DeleteFileMutationResponse;
    QueryParams: DeleteFileQueryParams;
};