import { useQuery } from '@tanstack/react-query';
import { getProfessors } from '@/api/professor';

export function useProfessors(params = {}) {
  return useQuery({
    queryKey: ['professors', params],
    queryFn: () => getProfessors(params),
  });
}
