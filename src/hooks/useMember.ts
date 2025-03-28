import { useQuery } from '@tanstack/react-query';
import { getCurrentMember } from '@/api/member';
import { useAuthStore } from '@/store/useAuthStore';

export function useGetCurrentMember(options = {}) {
  const { isLoggedIn } = useAuthStore();

  return useQuery({
    queryKey: ['currentMember'],
    queryFn: () => getCurrentMember(),
    enabled: isLoggedIn,
    ...options,
  });
}
