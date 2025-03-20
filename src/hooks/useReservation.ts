import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createReservation, getReservations } from '@/api/reservation';
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

export function useGetReservations(params = {}) {
  return useQuery({
    queryKey: ['reservations', params],
    queryFn: () => getReservations(params),
  });
}
