import { api } from '@/api';

export async function getScheduleView(facilityId: number, params = {}) {
  const response = await api.get(`/admin/facilities/${facilityId}/schedules`, {
    params,
  });
  return response.data;
}

export async function uploadScheduleExcel(
  file: File,
  params: {
    overwrite: boolean;
    validStartDate?: string;
    validEndDate?: string;
  } = { overwrite: true }
) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/admin/schedules/upload-excel', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    params,
  });
  return response.data;
}
