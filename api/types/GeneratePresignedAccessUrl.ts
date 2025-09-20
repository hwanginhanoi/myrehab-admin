export type GeneratePresignedAccessUrlPathParams = {
    /**
     * @type string
    */
    folder: string;
    /**
     * @type string
    */
    fileName: string;
};
export type GeneratePresignedAccessUrlQueryParams = {
    /**
     * @description URL expiration duration in minutes
     * @default 60
     * @type integer | undefined, int32
    */
    durationMinutes?: number;
};
/**
 * @description OK
*/
export type GeneratePresignedAccessUrl200 = string;
/**
 * @description OK
*/
export type GeneratePresignedAccessUrlQueryResponse = string;
export type GeneratePresignedAccessUrlQuery = {
    Response: GeneratePresignedAccessUrlQueryResponse;
    PathParams: GeneratePresignedAccessUrlPathParams;
    QueryParams: GeneratePresignedAccessUrlQueryParams;
};