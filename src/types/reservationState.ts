export const RESERVATION_STATES = {
  UNAVAILABLE: { label: '이용불가', color: '#DBDBDB' },
  AVAILABLE: { label: '예약가능', color: '#008FD5' },
  RESERVED: { label: '예약완료', color: '#767676' },
  WAITING: { label: '예약대기', color: '#002E66' },
} as const;

export type ReservationState = keyof typeof RESERVATION_STATES;
