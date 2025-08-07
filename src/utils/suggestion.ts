import { CATEGORY_OPTIONS, STATUS_OPTIONS } from '@/constants/suggestion';

export const getCategoryOptions = () => [
  { value: '', label: '전체' },
  ...CATEGORY_OPTIONS,
];

export const getStatusOptions = () => [
  { value: '', label: '전체' },
  ...STATUS_OPTIONS,
];

export const getSuggestionStatusStyles = (statusCode: string) => {
  switch (statusCode) {
    case 'RECEIVED':
      return 'bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium';
    case 'IN_REVIEW':
      return 'bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium';
    case 'COMPLETED':
      return 'bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium';
    default:
      return 'bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium';
  }
};

export const getSuggestionStatusText = (statusCode: string) => {
  switch (statusCode) {
    case 'RECEIVED':
      return '접수됨';
    case 'IN_REVIEW':
      return '검토중';
    case 'COMPLETED':
      return '완료';
    default:
      return statusCode || '-';
  }
};

export const getSuggestionCategoryStyles = (categoryCode: string) => {
  switch (categoryCode) {
    case 'NONE':
      return 'bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium';
    case 'DIRTY':
      return 'bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium';
    case 'REQUEST':
      return 'bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium';
    case 'BROKEN':
      return 'bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium';
    case 'ETC':
      return 'bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium';
    default:
      return 'bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium';
  }
};

export const getSuggestionCategoryText = (categoryCode: string) => {
  switch (categoryCode) {
    case 'NONE':
      return '시설 / 비품 부족';
    case 'DIRTY':
      return '청소 / 위생';
    case 'REQUEST':
      return '요청 사항';
    case 'BROKEN':
      return '고장 / 파손';
    case 'ETC':
      return '기타';
    default:
      return categoryCode || '-';
  }
};
