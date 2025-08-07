export type Suggestion = {
  id: number;
  title: string;
  content: string;
  category: string;
  categoryCode: string;
  status: string;
  statusCode: string;
  maskedStudentName: string;
  facilityNumber: string;
  answer: string | null;
  answeredAt: string | null;
  createdAt: string;
};

export type SuggestionPayload = {
  category: string;
  facilityId: number;
  title: string;
  content: string;
};
