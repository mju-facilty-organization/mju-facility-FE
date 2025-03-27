import { api } from '@/api';

type MemberResponse = {
  httpStatusCode: number;
  message: string;
  data: {
    id: number;
    name: string;
  };
  resultType: string;
};

export async function getCurrentMember() {
  const response = await api.get<MemberResponse>('/members');
  return response.data;
}
