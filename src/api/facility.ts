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

export async function getFacilities(
  page = 0,
  size = 10,
  facilityType?: string
) {
  let url = `/admin/facilities?page=${page}&size=${size}`;

  if (facilityType) {
    url += `&facility-type=${facilityType}`;
  }

  const response = await api.get(url);
  return response.data;
}
