import type { PatientDto } from "./PatientDto";

 /**
 * @description OK
*/
export type CreatePatient200 = PatientDto;
export type CreatePatientMutationRequest = PatientDto;
/**
 * @description OK
*/
export type CreatePatientMutationResponse = PatientDto;
export type CreatePatientMutation = {
    Response: CreatePatientMutationResponse;
    Request: CreatePatientMutationRequest;
};