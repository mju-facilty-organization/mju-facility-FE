import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getApprovalData,
  processApproval,
  processPicApproval,
  ApprovalResult,
} from '@/api/approval';

export function useApprovalData(professorApprovalId: string | undefined) {
  return useQuery({
    queryKey: ['approval', professorApprovalId],
    queryFn: () => getApprovalData(professorApprovalId!),
    enabled: !!professorApprovalId,
  });
}

export function useProcessApproval() {
  return useMutation({
    mutationFn: async ({
      professorApprovalId,
      result,
      reason = '',
    }: {
      professorApprovalId: string;
      result: ApprovalResult | string;
      reason?: string;
    }) => {
      return processApproval(professorApprovalId, result, reason);
    },
  });
}

export function useProcessPicApproval() {
  return useMutation({
    mutationFn: async ({
      rentalHistoryId,
      result,
      reason = '',
    }: {
      rentalHistoryId: string;
      result: ApprovalResult | string;
      reason?: string;
    }) => {
      return processPicApproval(rentalHistoryId, result, reason);
    },
  });
}
