import { api } from '@/api';
import type { SuggestionPayload } from '@/types/suggestion';

export async function getSuggestions(params = {}) {
  const response = await api.get('/suggestions', { params });
  return response.data;
}

export async function createSuggestion(suggestionData: SuggestionPayload) {
  const response = await api.post('/suggestions', suggestionData);
  return response.data;
}

export async function deleteSuggestion(suggestionId: number) {
  const response = await api.delete(`/suggestions/${suggestionId}`);
  return response.data;
}

export async function updateSuggestion(
  suggestionId: number,
  suggestionData: {
    category: string;
    facilityId: number;
    title: string;
    content: string;
  }
) {
  const response = await api.patch(
    `/suggestions/${suggestionId}`,
    suggestionData
  );
  return response.data;
}

export async function getMySuggestions(params = {}) {
  const response = await api.get('/suggestions/me', { params });
  return response.data;
}
