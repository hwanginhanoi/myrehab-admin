export type PresignedUrlRequest = {
    /**
     * @type string
    */
    fileName: string;
    /**
     * @type string
    */
    contentType: string;
    /**
     * @type string | undefined
    */
    fileType?: string;
    /**
     * @type integer | undefined, int32
    */
    durationMinutes?: number;
};