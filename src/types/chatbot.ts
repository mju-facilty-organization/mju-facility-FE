import type { QueryCategory } from '@/api/chatbot';

export type Message = {
  id: number;
  text: string;
  isBot: boolean;
  showCategories?: boolean;
  isCategory?: boolean;
};

export type Category = {
  key: QueryCategory;
  name: string;
  description: string;
  icon: string;
};
