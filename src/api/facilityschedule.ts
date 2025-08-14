import { api } from '@/api';

export async function getScheduleView(facilityId: number, params = {}) {
  const response = await api.get(`/admin/facilities/${facilityId}/schedules`, {
    params,
  });
  return response.data;
}
