import type { PatientDto } from "./PatientDto";

 /**
 * @description OK
*/
export type GetAllPatients200 = PatientDto[];
/**
 * @description OK
*/
export type GetAllPatientsQueryResponse = PatientDto[];
export type GetAllPatientsQuery = {
    Response: GetAllPatientsQueryResponse;
};