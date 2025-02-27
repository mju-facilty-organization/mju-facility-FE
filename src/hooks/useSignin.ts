import { useMutation } from '@tanstack/react-query';
import { signin } from '@/api/auth';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export function useSignin() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const response = await signin(email, password);
      return response;
    },
    onSuccess: (response) => {
      const { accessToken, grantType } = response.data;
      const role = grantType !== 'ROLE_STUDENT' ? 'ADMIN' : 'STUDENT';

      login({ role, name: '' }, `${grantType} ${accessToken}`);

      navigate(role === 'ADMIN' ? '/admin' : '/');
    },
  });
}
