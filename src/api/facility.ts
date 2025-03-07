import { api } from '@/api';
import { Facility } from '@/types/facility';

export async function createFacility(facilityData: Facility) {
  const response = await api.post('/admin/facilities', facilityData);
  return response.data;
}

export async function uploadFileToPresignedUrl(url: string, file: File) {
  return fetch(url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });
}

export async function getFacilities(page = 0, size = 10) {
  const response = await api.get(`/admin/facilities?page=${page}&size=${size}`);
  return response.data;
}
