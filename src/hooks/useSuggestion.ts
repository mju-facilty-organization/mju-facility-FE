import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import type { SuggestionPayload } from '@/types/suggestion';
import {
  getSuggestions,
  getMySuggestions,
  createSuggestion,
  updateSuggestion,
  deleteSuggestion,
  createSuggestionAnswer,
  updateSuggestionAnswer,
  updateSuggestionStatus,
  getSuggestionStatics,
} from '@/api/suggestions';

export const useSuggestions = (filter = {}) => {
  return useQuery({
    queryKey: ['suggestions', filter],
    queryFn: () => getSuggestions(filter),
    staleTime: 5 * 60 * 1000,
  });
};

export const useMySuggestions = (
  filter = {},
  options: { enabled?: boolean } = {}
) => {
  return useQuery({
    queryKey: ['my-suggestions', filter],
    queryFn: () => getMySuggestions(filter),
    staleTime: 3 * 60 * 1000,
    enabled: options.enabled !== false,
    ...options,
  });
};

export const useCreateSuggestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SuggestionPayload) => createSuggestion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
      queryClient.invalidateQueries({ queryKey: ['my-suggestions'] });
      toast.success('건의사항이 등록되었습니다.');
    },
    onError: (error: Error) => {
      console.error('건의사항 등록 실패:', error);
      toast.error('건의사항 등록에 실패했습니다.');
    },
  });
};

export const useUpdateSuggestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      suggestionId,
      data,
    }: {
      suggestionId: number;
      data: SuggestionPayload;
    }) => updateSuggestion(suggestionId, data),
    onSuccess: ({ suggestionId }) => {
      queryClient.invalidateQueries({ queryKey: ['suggestion', suggestionId] });
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
      queryClient.invalidateQueries({ queryKey: ['my-suggestions'] });
      toast.success('건의사항이 수정되었습니다.');
    },
    onError: (error: Error) => {
      console.error('건의사항 수정 실패:', error);
      toast.error('건의사항 수정에 실패했습니다.');
    },
  });
};

export const useDeleteSuggestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (suggestionId: number) => deleteSuggestion(suggestionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
      queryClient.invalidateQueries({ queryKey: ['my-suggestions'] });
      toast.success('건의사항이 삭제되었습니다.');
    },
    onError: (error: Error) => {
      console.error('건의사항 삭제 실패:', error);
      toast.error('건의사항 삭제에 실패했습니다.');
    },
  });
};

export const useCreateSuggestionAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      suggestionId,
      answer,
    }: {
      suggestionId: number;
      answer: string;
    }) => createSuggestionAnswer(suggestionId, answer),
    onSuccess: (variables) => {
      queryClient.invalidateQueries({
        queryKey: ['suggestion', variables.suggestionId],
      });
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
      toast.success('건의사항 답변이 등록되었습니다.');
    },
    onError: (error: Error) => {
      console.error('건의사항 답변 등록 실패:', error);
      toast.error('건의사항 답변 등록에 실패했습니다.');
    },
  });
};

export const useUpdateSuggestionAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      suggestionId,
      answer,
    }: {
      suggestionId: number;
      answer: string;
    }) => updateSuggestionAnswer(suggestionId, answer),
    onSuccess: (variables) => {
      queryClient.invalidateQueries({
        queryKey: ['suggestion', variables.suggestionId],
      });
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
      toast.success('건의사항 답변이 수정되었습니다.');
    },
    onError: (error: Error) => {
      console.error('건의사항 답변 수정 실패:', error);
      toast.error('건의사항 답변 수정에 실패했습니다.');
    },
  });
};

export const useUpdateSuggestionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      suggestionId,
      status,
    }: {
      suggestionId: number;
      status: 'RECEIVED' | 'IN_REVIEW' | 'COMPLETED';
    }) => updateSuggestionStatus(suggestionId, status),
    onSuccess: (variables) => {
      queryClient.invalidateQueries({
        queryKey: ['suggestion', variables.suggestionId],
      });
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
      toast.success('건의사항 상태가 변경되었습니다.');
    },
    onError: (error: Error) => {
      console.error('건의사항 상태 변경 실패:', error);
      toast.error('건의사항 상태 변경에 실패했습니다.');
    },
  });
};

export const useSuggestionActions = () => {
  const createMutation = useCreateSuggestion();
  const updateMutation = useUpdateSuggestion();
  const deleteMutation = useDeleteSuggestion();

  return {
    create: (data: SuggestionPayload) => createMutation.mutate(data),
    update: (suggestionId: number, data: SuggestionPayload) =>
      updateMutation.mutate({ suggestionId, data }),
    delete: (suggestionId: number) => deleteMutation.mutate(suggestionId),
    isLoading:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
};

export const useSuggestionAdminActions = () => {
  const createAnswerMutation = useCreateSuggestionAnswer();
  const updateAnswerMutation = useUpdateSuggestionAnswer();
  const updateStatusMutation = useUpdateSuggestionStatus();

  return {
    createAnswer: (suggestionId: number, answer: string) =>
      createAnswerMutation.mutate({ suggestionId, answer }),
    updateAnswer: (suggestionId: number, answer: string) =>
      updateAnswerMutation.mutate({ suggestionId, answer }),
    updateStatus: (
      suggestionId: number,
      status: 'RECEIVED' | 'IN_REVIEW' | 'COMPLETED'
    ) => updateStatusMutation.mutate({ suggestionId, status }),
    isLoading:
      createAnswerMutation.isPending ||
      updateAnswerMutation.isPending ||
      updateStatusMutation.isPending,
  };
};

export const useSuggestionStatistics = (filter = {}) => {
  return useQuery({
    queryKey: ['suggestion-statistics', filter],
    queryFn: () => getSuggestionStatics(filter),
    staleTime: 5 * 60 * 1000,
  });
};
