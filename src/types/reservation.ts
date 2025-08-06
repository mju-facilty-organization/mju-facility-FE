import { Student } from '@/types/student';
import { RentalApplicationResult } from '@/types/approval';

export type FacilityResponse = {
  facilityType: string;
  facilityNumber: string;
};

export type ProfessorApprovalResponse = {
  professorName: string;
  professorAffiliation: string;
  professorEmail: string;
  applicationResult: RentalApplicationResult;
  reason: string | null;
};

export type ReservationInfo = {
  id: number;
  facilityResponse: FacilityResponse;
  professorApprovalResponse: ProfessorApprovalResponse | null;
  createAt: string;
  defineDateTime: string | null;
  organization: string;
  purpose: string;
  applicationResult: RentalApplicationResult;
  startTime: string;
  endTime: string;
};

export type ReservationDetailInfo = {
  studentInfoResponse: Student;
  rentalHistoryResponseDto: ReservationInfo;
};
