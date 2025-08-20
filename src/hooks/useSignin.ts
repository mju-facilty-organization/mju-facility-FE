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
      expectedRole,
    }: {
      email: string;
      password: string;
      expectedRole?: 'student' | 'admin';
    }) => {
      const response = await signin(email, password);

      if (
        response.httpStatusCode !== 200 ||
        response.resultType !== 'SUCCESS'
      ) {
        throw new Error(response.message || '로그인에 실패했습니다.');
      }

      const { grantType, accessToken, refreshToken } = response.data;

      if (!grantType || !accessToken || !refreshToken) {
        throw new Error('서버 응답에 필요한 정보가 없습니다.');
      }

      if (expectedRole) {
        const actualRole = grantType !== 'ROLE_STUDENT' ? 'ADMIN' : 'STUDENT';
        const expectedRoleUpper = expectedRole.toUpperCase();

        if (actualRole !== expectedRoleUpper) {
          const roleText = expectedRole === 'admin' ? '관리자' : '학생';
          throw new Error(`${roleText} 계정으로 로그인해주세요.`);
        }
      }

      return {
        grantType,
        accessToken,
        refreshToken,
      };
    },
    onSuccess: (data) => {
      const { grantType, accessToken, refreshToken } = data;
      const role = grantType !== 'ROLE_STUDENT' ? 'ADMIN' : 'STUDENT';

      login({ role, name: '' }, accessToken, refreshToken);
      navigate(role === 'ADMIN' ? '/admin' : '/');
    },
  });
}
