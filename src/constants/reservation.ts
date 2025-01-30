export const DEPARTMENTS = {
  인문대: [
    '국어국문학과',
    '문예창작학과',
    '영어영문학과',
    '중어중문학과',
    '일어일문학과',
    '문헌정보학과',
    '미술사학과',
    '아랍지역학과',
    '사학과',
    '철학과',
  ],
  사회과학대: [
    '행정학과',
    '경제학과',
    '정치외교학과',
    '디지털미디어학과',
    '아동학과',
    '청소년지도학과',
  ],
  경영대: ['경영학과', '경영정보학과', '국제통상학과'],
  법대: ['법학과'],
  ICT융합대: [
    '디지털콘텐츠디자인학과',
    '응용소프트웨어전공',
    '데이터테크놀로지전공',
  ],
} as const;

export const BUILDINGS = [
  '본관',
  '국제관',
  '학생회관',
  'MCC',
  '도서관',
  '야외',
] as const;

export type Department = keyof typeof DEPARTMENTS;
export type Building = (typeof BUILDINGS)[number];
