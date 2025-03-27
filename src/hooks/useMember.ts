import { useQuery } from '@tanstack/react-query';
import { getCurrentMember } from '@/api/member';

export function useGetCurrentMember() {
  return useQuery({
    queryKey: ['currentMember'],
    queryFn: () => getCurrentMember(),
  });
}
