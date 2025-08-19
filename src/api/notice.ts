import { api } from '@/api';

export async function getNotices(params = {}) {
  const response = await api.get('/notices', { params });
  return response.data;
}

export async function getNoticeDetail(noticeId: number) {
  const response = await api.get(`/notices/${noticeId}`);
  return response.data;
}

export async function createNotice(noticeData: {
  title: string;
  content: string;
  imageName?: string;
}) {
  const response = await api.post('/notices', noticeData);
  return response.data;
}
