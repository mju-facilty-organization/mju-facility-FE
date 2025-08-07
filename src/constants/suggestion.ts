export const CATEGORY_OPTIONS = [
  { value: 'NONE', label: '시설 / 비품 부족' },
  { value: 'DIRTY', label: '청소 / 위생' },
  { value: 'REQUEST', label: '요청 사항' },
  { value: 'BROKEN', label: '고장 / 파손' },
  { value: 'ETC', label: '기타' },
] as const;

export const STATUS_OPTIONS = [
  { value: 'RECEIVED', label: '접수됨' },
  { value: 'IN_REVIEW', label: '검토중' },
  { value: 'COMPLETED', label: '완료' },
] as const;
