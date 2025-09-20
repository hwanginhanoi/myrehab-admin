export type PresignedUrlResponse = {
    /**
     * @type string | undefined
    */
    uploadUrl?: string;
    /**
     * @type string | undefined
    */
    fileUrl?: string;
    /**
     * @type string | undefined
    */
    fileName?: string;
    /**
     * @type string | undefined
    */
    folder?: string;
    /**
     * @type string | undefined, date-time
    */
    expiresAt?: string;
    /**
     * @type string | undefined
    */
    contentType?: string;
};