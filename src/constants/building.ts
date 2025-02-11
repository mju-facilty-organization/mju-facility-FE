export const BUILDINGS = [
  '본관',
  '국제관',
  '학생회관',
  'MCC',
  '도서관',
  '야외',
] as const;

export type Building = (typeof BUILDINGS)[number];
