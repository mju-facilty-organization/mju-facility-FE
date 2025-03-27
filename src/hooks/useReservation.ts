import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createReservation,
  getReservations,
  getReservationDetail,
  getStudentReservations,
} from '@/api/reservation';
import { Reservation } from '@/types/reservation';

export function useCreateReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reservationData: Reservation) =>
      createReservation(reservationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservationHistory'] });
    },
  });
}

export function useGetReservations(page = 0, size = 10, additionalParams = {}) {
  return useQuery({
    queryKey: ['reservations', page, size, additionalParams],
    queryFn: () => getReservations(page, size, additionalParams),
  });
}

export function useGetReservationDetail(rentalHistoryId: number | undefined) {
  return useQuery({
    queryKey: ['reservation', rentalHistoryId],
    queryFn: () => getReservationDetail(rentalHistoryId as number),
    enabled: !!rentalHistoryId,
  });
}

export function useGetStudentReservations(studentId: string | undefined) {
  return useQuery({
    queryKey: ['studentReservations', studentId],
    queryFn: () => getStudentReservations(studentId as string),
    enabled: !!studentId,
  });
}
