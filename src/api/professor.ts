import { api } from '@/api';

export async function getProfessors(params = {}) {
  const response = await api.get('/professors', { params });
  return response.data;
}
