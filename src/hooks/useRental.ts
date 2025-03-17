import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createReservation,
} from '@/api/rental';
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
