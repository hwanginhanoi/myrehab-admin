export type FileUploadResponse = {
    /**
     * @type string | undefined
    */
    fileName?: string;
    /**
     * @type string | undefined
    */
    originalFileName?: string;
    /**
     * @type string | undefined
    */
    fileUrl?: string;
    /**
     * @type string | undefined
    */
    fileType?: string;
    /**
     * @type integer | undefined, int64
    */
    fileSize?: number;
    /**
     * @type string | undefined
    */
    folder?: string;
};