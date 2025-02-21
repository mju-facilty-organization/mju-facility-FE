import { useMutation } from '@tanstack/react-query';
import {
  checkEmailDuplicate,
  sendVerificationCode,
  verifyEmailCode,
} from '@/api/auth';

export function useEmailVerification() {
  const checkDuplicateMutation = useMutation({
    mutationFn: checkEmailDuplicate,
  });

  const sendCodeMutation = useMutation({
    mutationFn: sendVerificationCode,
  });

  const verifyCodeMutation = useMutation({
    mutationFn: ({ email, authCode }: { email: string; authCode: number }) =>
      verifyEmailCode(email, authCode),
  });

  return {
    checkDuplicateMutation,
    sendCodeMutation,
    verifyCodeMutation,
  };
}
