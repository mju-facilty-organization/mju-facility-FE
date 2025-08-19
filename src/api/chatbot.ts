import { api } from '@/api';

export type QueryCategory =
  | 'DEPARTMENTAL_FACILITY'
  | 'USER_FACILITY'
  | 'GENERAL_FACILITY'
  | 'SPECIAL_PURPOSE_ROOM';

export type ChatbotRequest = {
  queryCategory: QueryCategory;
  question: string;
};

export type ChatbotResponse = {
  httpStatusCode: number;
  message: string;
  data: string;
  resultType: 'SUCCESS' | 'FAILURE';
};

export async function askChatbot(request: ChatbotRequest) {
  const response = await api.post<ChatbotResponse>('api/chatbot/ask', request);
  return response.data;
}
