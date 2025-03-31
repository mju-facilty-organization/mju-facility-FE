import { api } from '@/api';

export type ApprovalResult = 'PERMITTED' | 'DENIED';

export async function getApprovalData(professorApprovalId: string) {
  const response = await api.get(`/approval/professor/${professorApprovalId}`);
  return response.data;
}

export async function processApproval(
  professorApprovalId: string,
  result: ApprovalResult | string,
  reason: string = ''
) {
  const finalResult = result.startsWith('PROFESSOR_')
    ? result
    : `PROFESSOR_${result}`;

  const response = await api.post(
    `/approval/professor/${professorApprovalId}`,
    {
      rentalApplicationResult: finalResult,
      reason: reason,
    }
  );
  return response.data;
}

export async function processPicApproval(
  rentalHistoryId: string,
  result: ApprovalResult | string,
  reason: string = ''
) {
  const finalResult = result.startsWith('PIC_') ? result : `PIC_${result}`;

  const response = await api.post(`/approval/pic/${rentalHistoryId}`, {
    rentalApplicationResult: finalResult,
    reason: reason,
  });
  return response.data;
}
