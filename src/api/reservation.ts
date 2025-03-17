import { api } from '@/api';
import { Reservation } from '@/types/reservation';

export async function createReservation(reservationData: Reservation) {
  const response = await api.post('/rental', reservationData);
  return response.data;
}
