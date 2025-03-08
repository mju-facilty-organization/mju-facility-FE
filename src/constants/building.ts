export const BUILDINGS = [
  '본관',
  '국제관',
  '학생회관',
  'mcc',
  '도서관',
  '야외',
] as const;

export type Building = (typeof BUILDINGS)[number];

export const FACILITY_TYPE_MAP: Record<string, Building> = {
  MAIN_BUILDING: '본관',
  INTERNATIONAL_BUILDING: '국제관',
  STUDENT_HALL: '학생회관',
  MCC: 'mcc',
  LIBRARY: '도서관',
  OUTDOOR: '야외',
};
