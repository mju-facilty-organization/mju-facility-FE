import { api } from '@/api';
import { Signup } from '@/types/auth';

export async function signup(data: Signup) {
  const response = await api.post('/students/sign-up', data);
  return response.data;
}

export async function checkEmailDuplicate(email: string) {
  const response = await api.post('/email/check-duplicate', { email });
  return response.data;
}

export async function sendVerificationCode(email: string) {
  const response = await api.post('/email/send-code', { email });
  return response.data;
}

export async function verifyEmailCode(email: string, authCode: number) {
  const response = await api.post('/email/check-code', { email, authCode });
  return response.data;
}
