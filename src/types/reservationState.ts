export const RESERVATION_STATES = {
  UNAVAILABLE: { label: '이용불가', color: '#E5E7EB' },
  AVAILABLE: { label: '예약가능', color: '#008FD5' },
  RESERVED: { label: '예약완료', color: '#6B7280' },
  WAITING: { label: '예약대기', color: '#BFDBFE' },
} as const;

export type ReservationState = keyof typeof RESERVATION_STATES;
