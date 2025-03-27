import { ApprovalStatus } from '@/types/reservation';
export type Professor = {
  id: number;
  name: string;
  campus: string;
  college: string;
  major: string;
  email: string;
};

export type ProfessorApprovalResponse = {
  professorName: string;
  professorAffiliation: string;
  professorEmail: string;
  reason: string | null;
  applicationResult?: ApprovalStatus;
};
