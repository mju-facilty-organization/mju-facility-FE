export type Professor = {
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
};
