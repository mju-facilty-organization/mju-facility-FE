import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRegularSchedule } from '@/api/regularschedule';

export function useCreateRegularScheduleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRegularSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
    onError: (error) => {
      console.error('정기 스케줄 생성 실패:', error);
    },
  });
}
