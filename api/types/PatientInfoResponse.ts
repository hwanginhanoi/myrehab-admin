export type PatientInfoResponse = {
    /**
     * @type integer, int64
    */
    id: number;
    /**
     * @type string
    */
    email: string;
    /**
     * @type string
    */
    firstName: string;
    /**
     * @type string
    */
    lastName: string;
    /**
     * @type string | undefined
    */
    phoneNumber?: string;
    /**
     * @type string | undefined
    */
    medicalHistory?: string;
    /**
     * @type string | undefined
    */
    dateOfBirth?: string;
    /**
     * @type string | undefined
    */
    gender?: string;
};