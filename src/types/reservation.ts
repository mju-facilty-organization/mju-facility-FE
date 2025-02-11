export const RESERVATION_STATES = {
  UNAVAILABLE: { label: '이용불가', color: '#DBDBDB' },
  AVAILABLE: { label: '예약가능', color: '#008FD5' },
  COMPLETED: { label: '예약완료', color: '#767676' },
  PENDING: { label: '예약대기', color: '#002E66' },
  CURRENT: { label: '현재예약', color: '#FFB800' },
} as const;

export type ReservationState = keyof typeof RESERVATION_STATES;

export interface TimeSlotData {
  [key: string]: string;
}
export interface TimeValue {
  hour: string;
  minute: string;
}

export interface FormData {
  date: string;
  startTime: TimeValue;
  endTime: TimeValue;
  groupName: string;
  attendeesName: string;
  attendeesCount: string;
  purpose: UsagePurpose | '';
  purposeDetail: string;
  professor: string;
}
