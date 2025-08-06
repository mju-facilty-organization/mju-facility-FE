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
  facilityId: number;
  answer: string | null;
  answeredAt: string | null;
  createdAt: string;
};
