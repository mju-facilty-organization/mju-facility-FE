import { api } from '@/api';

export type ApprovalResult = 'PERMITTED' | 'DENIED';

export async function getApprovalData(professorApprovalId: string) {
  const response = await api.get(`/approval/professor/${professorApprovalId}`);
  return response.data;
}

export async function processApproval(
  professorApprovalId: string,
  result: ApprovalResult,
  reason: string = ''
) {
  const response = await api.post(
    `/approval/professor/${professorApprovalId}`,
    {
      rentalApplicationResult: result,
      reason: reason,
    }
  );
  return response.data;
}
