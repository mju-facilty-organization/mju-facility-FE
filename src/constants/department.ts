export const DEPARTMENTS = {
  인문대학: [
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
  사회과학대학: [
    '행정학과',
    '경제학과',
    '정치외교학과',
    '디지털미디어학과',
    '아동학과',
    '청소년지도학과',
  ],
  경영대학: ['경영학과', '경영정보학과', '국제통상학과'],
  법학대학: ['법학과'],
  ICT융합대학: [
    '디지털콘텐츠디자인학과',
    '응용소프트웨어전공',
    '데이터테크놀로지전공',
  ],
} as const;

export type College = keyof typeof DEPARTMENTS;
export type Department = (typeof DEPARTMENTS)[College][number];

export const DEPARTMENT_ENGLISH_TO_KOREAN: Record<string, Department> = {
  KOREAN_LANGUAGE_AND_LITERATURE: '국어국문학과',
  CREATIVE_WRITING: '문예창작학과',
  ENGLISH_LANGUAGE_AND_LITERATURE: '영어영문학과',
  CHINESE_LANGUAGE_AND_LITERATURE: '중어중문학과',
  JAPANESE_LANGUAGE_AND_LITERATURE: '일어일문학과',
  LIBRARY_AND_INFORMATION_SCIENCE: '문헌정보학과',
  ART_HISTORY: '미술사학과',
  ARABIC_STUDIES: '아랍지역학과',
  HISTORY: '사학과',
  PHILOSOPHY: '철학과',
  PUBLIC_ADMINISTRATION: '행정학과',
  ECONOMICS: '경제학과',
  POLITICAL_SCIENCE_AND_DIPLOMACY: '정치외교학과',
  DIGITAL_MEDIA: '디지털미디어학과',
  CHILD_STUDIES: '아동학과',
  YOUTH_GUIDANCE: '청소년지도학과',
  BUSINESS_ADMINISTRATION: '경영학과',
  MANAGEMENT_INFORMATION_SYSTEMS: '경영정보학과',
  INTERNATIONAL_TRADE: '국제통상학과',
  DEPARTMENT_OF_LAW: '법학과',
  DIGITAL_CONTENTS_DESIGN: '디지털콘텐츠디자인학과',
  SOFTWARE_APPLICATIONS: '응용소프트웨어전공',
  DATA_TECHNOLOGY: '데이터테크놀로지전공',
};
