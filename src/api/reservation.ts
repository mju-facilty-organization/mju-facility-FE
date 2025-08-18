import { api } from '@/api';
import { Reservation } from '@/types/reservation';

export async function createReservation(reservationData: Reservation) {
  const response = await api.post('/rental', reservationData);
  return response.data;
}

export async function getReservations(
  page = 0,
  size = 10,
  additionalParams = {}
) {
  const params = {
    page,
    size,
    ...additionalParams,
  };

  const response = await api.get('/rental', { params });
  return response.data;
}

export async function getReservationDetail(rentalHistoryId: number) {
  const response = await api.get(`/rental/${rentalHistoryId}`);
  return response.data;
}

export async function getStudentReservations(studentId: string) {
  const response = await api.get(`/rental/students/${studentId}`);
  return response.data;
}

export async function getFacilityInUse(facilityId: number) {
  const response = await api.get(`/rental/facilities/${facilityId}/in-use`);
  return response.data;
}
