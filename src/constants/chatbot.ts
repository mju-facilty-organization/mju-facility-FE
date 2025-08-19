import type { QueryCategory } from '@/api/chatbot';
import type { Category, Message } from '@/types/chatbot';

export const CATEGORIES: Category[] = [
  {
    key: 'DEPARTMENTAL_FACILITY' as QueryCategory,
    name: '학부/과별 시설',
    description: '전공별 강의실 및 전용 시설',
    icon: '🏫',
  },
  {
    key: 'USER_FACILITY' as QueryCategory,
    name: '사용자 관련 시설',
    description: '사용자가 이용 가능한 시설 문의',
    icon: '👤',
  },
  {
    key: 'GENERAL_FACILITY' as QueryCategory,
    name: '공공 시설',
    description: '모든 학생이 이용 가능한 시설',
    icon: '🏛️',
  },
  {
    key: 'SPECIAL_PURPOSE_ROOM' as QueryCategory,
    name: '특별 강의실',
    description: '특별한 장비가 있는 강의실',
    icon: '🔬',
  },
];

export const INITIAL_MESSAGE: Message = {
  id: 1,
  text: '안녕하세요! 👋 시설 예약을 도와드릴게요\n\n먼저 문의 유형을 선택해주세요:',
  isBot: true,
  showCategories: true,
};
