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
  facilityType?: Facility['facilityType']
) {
  let url = `/admin/facilities?page=${page}&size=${size}`;

  if (facilityType) {
    url += `&facility-type=${facilityType}`;
  }

  const response = await api.get(url);
  return response.data;
}

export async function getFacilityDetail(
  facilityId: Facility['id'],
  date?: string
) {
  let url = `/admin/facilities/${facilityId}`;

  if (date) {
    url += `?date=${date}`;
  }

  const response = await api.get(url);
  return response.data;
}

export async function importFacilitiesFromExcel(
  file: File,
  dryRun: boolean = false,
  overwrite: boolean = true
) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/admin/facilities/import', formData, {
    params: { dryRun, overwrite },
  });

  return response.data;
}

export async function deleteFacility(facilityId: Facility['id']) {
  const response = await api.delete(`/admin/facilities/${facilityId}`);
  return response.data;
}
