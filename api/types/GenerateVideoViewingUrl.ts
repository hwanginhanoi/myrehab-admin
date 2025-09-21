export type GenerateVideoViewingUrlQueryParams = {
    /**
     * @description Full video file URL
     * @type string
    */
    fileUrl: string;
    /**
     * @description URL expiration duration in minutes
     * @default 5
     * @type integer | undefined, int32
    */
    durationMinutes?: number;
};
/**
 * @description OK
*/
export type GenerateVideoViewingUrl200 = string;
/**
 * @description OK
*/
export type GenerateVideoViewingUrlQueryResponse = string;
export type GenerateVideoViewingUrlQuery = {
    Response: GenerateVideoViewingUrlQueryResponse;
    QueryParams: GenerateVideoViewingUrlQueryParams;
};