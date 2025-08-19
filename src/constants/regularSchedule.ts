export const SCHEDULE_TYPES = [
  { value: 'CLUB', label: '동아리' },
  { value: 'SEMINAR', label: '세미나' },
  { value: 'MEETING', label: '회의' },
  { value: 'OTHER', label: '기타' },
] as const;

export const DAY_NAMES = {
  MONDAY: '월',
  TUESDAY: '화',
  WEDNESDAY: '수',
  THURSDAY: '목',
  FRIDAY: '금',
  SATURDAY: '토',
  SUNDAY: '일',
} as const;

export const DAY_ORDER = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
] as const;

export const TIME_SLOT_CONFIG = {
  START_HOUR: 8,
  END_HOUR: 22,
  SLOTS_PER_HOUR: 2,
  TOTAL_SLOTS: 28,
} as const;
