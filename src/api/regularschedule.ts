import { api } from '@/api';

import type { RegularSchedule } from '@/types/RegularSchedule';

export async function createRegularSchedule(scheduleData: RegularSchedule) {
  const response = await api.post('/admin/schedules/regular', scheduleData);
  return response.data;
}
