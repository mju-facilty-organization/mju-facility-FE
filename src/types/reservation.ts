import { Facility } from '@/types/facility';
import { ProfessorApprovalResponse } from '@/types/professor';

export type ApprovalStatus = 'WAITING' | 'PERMITTED' | 'DENIED' | '';

export type Reservation = {
  facilityId?: string;
  startDateTime?: string;
  endDateTime?: string;
  organization?: string;
  numberOfPeople?: string | number;
  professorId?: string;
  purpose?: string;

  id?: number;
  facilityResponse?: Facility;
  professorApprovalResponse?: ProfessorApprovalResponse;
  createAt?: string;
  defineDateTime?: string | null;
  applicationResult: ApprovalStatus;
};

export type ApprovalInfo = {
  approvalStatus: ApprovalStatus;
  reason: string;
};
